import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Flame, TreePine, Sprout, X, Trophy, Play, RotateCw, Droplets, Wind } from "lucide-react";

interface GameObject {
  id: number;
  x: number;
  type: 'fire' | 'tree' | 'sprout';
  health: number;
  scale: number;
  isWatered?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'rain' | 'smoke';
}

interface ForestGameProps {
  onClose: () => void;
}

const ForestGame = ({ onClose }: ForestGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [forestHealth, setForestHealth] = useState(100);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cloudX, setCloudX] = useState(50);
  const [isRaining, setIsRaining] = useState(false);

  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const cloudPosRef = useRef(50);
  const isRainingRef = useRef(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setForestHealth(100);
    setObjects([]);
    setParticles([]);
    setCloudX(50);
    
    cloudPosRef.current = 50;
    isRainingRef.current = false;
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
  };

  const handleInputStart = () => {
    setIsRaining(true);
    isRainingRef.current = true;
  };

  const handleInputEnd = () => {
    setIsRaining(false);
    isRainingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameAreaRef.current || !isPlaying || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    let newX = ((clientX - rect.left) / rect.width) * 100;
    newX = Math.max(5, Math.min(95, newX));
    setCloudX(newX);
    cloudPosRef.current = newX;
  };

  const updateGame = useCallback((time: number) => {
    if (gameOver || !isPlaying) return;

    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); 
    lastTimeRef.current = time;

    // 1. Spawning
    const currentScore = score;
    const spawnThreshold = Math.max(0.5, 1.5 - (currentScore * 0.01));

    if ((time - spawnTimerRef.current) / 1000 > spawnThreshold) {
      setObjects(prev => {
        let attempts = 0;
        let newX = 0;
        let validSpot = false;
        
        while (attempts < 8 && !validSpot) {
          newX = Math.random() * 80 + 10;
          validSpot = !prev.some(obj => Math.abs(obj.x - newX) < 12);
          attempts++;
        }

        if (validSpot) {
           const isFire = Math.random() > 0.55;
           spawnTimerRef.current = time;
           return [...prev, {
             id: Date.now(),
             x: newX,
             type: isFire ? 'fire' : 'sprout',
             health: isFire ? 100 : 0,
             scale: 0,
             isWatered: false
           }];
        }
        return prev;
      });
      spawnTimerRef.current = time;
    }

    // 2. Physics & Logic
    setObjects(prevObjects => {
      let damageDealt = 0;
      let scoreToAdd = 0;
      // FIXED: Use 'const' since we don't reassign the array, we just push to it
      const smokeToSpawn: Particle[] = [];

      const nextObjects = prevObjects.map(obj => {
        const dist = Math.abs(obj.x - cloudPosRef.current);
        const isUnderRain = isRainingRef.current && dist < 12;
        // FIXED: Use 'const' for the new object
        const newObj = { ...obj, isWatered: isUnderRain };

        if (newObj.type === 'fire') {
          if (isUnderRain) {
            newObj.health -= 150 * dt;
            // Spawn Smoke if Raining on fire
            if (Math.random() > 0.8) {
                smokeToSpawn.push({
                    id: Math.random(),
                    x: newObj.x + (Math.random() * 6 - 3),
                    y: 80 - (Math.random() * 10),
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -2 - Math.random(),
                    life: 1.0,
                    type: 'smoke'
                })
            }
          } else {
            newObj.scale = Math.min(1.3, newObj.scale + (0.1 * dt));
            damageDealt += 5 * dt;
          }
        } else if (newObj.type === 'sprout') {
          if (isUnderRain) {
            newObj.health += 40 * dt;
            newObj.scale = Math.min(1, 0.3 + (newObj.health / 100) * 0.7);
          }
          if (newObj.scale < 0.3) newObj.scale = Math.min(0.3, newObj.scale + dt);
        }
        return newObj;
      }).filter(obj => {
        if (obj.type === 'fire' && obj.health <= 0) {
          scoreToAdd += 50;
          return false;
        }
        if (obj.type === 'sprout' && obj.health >= 100) {
          scoreToAdd += 100;
          return false;
        }
        return true;
      });

      if (scoreToAdd > 0) setScore(s => s + scoreToAdd);
      
      // Inject smoke particles if needed
      if (smokeToSpawn.length > 0) {
          setParticles(prev => [...prev, ...smokeToSpawn]);
      }

      if (damageDealt > 0) {
        setForestHealth(h => {
          const newHealth = h - damageDealt;
          if (newHealth <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return newHealth;
        });
      }
      return nextObjects;
    });

    // 3. Particles (Rain & Smoke)
    if (isRainingRef.current) {
        const newParticlesCount = Math.floor(Math.random() * 2) + 1;
        const newParticles: Particle[] = [];
        for(let i=0; i<newParticlesCount; i++) {
            newParticles.push({
                id: Math.random(),
                x: cloudPosRef.current + (Math.random() * 14 - 7),
                y: 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 2 + 3,
                life: 1.0,
                type: 'rain'
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }

    setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + (p.type === 'rain' ? (p.vy * 60 * dt) : (p.vy * 20 * dt)), 
        life: p.life - (p.type === 'rain' ? 2 * dt : 1 * dt)
    })).filter(p => p.life > 0 && p.y < 88 && p.y > 0));

    gameLoopRef.current = requestAnimationFrame((t) => updateGame(t));
  }, [gameOver, isPlaying, score]); 

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = requestAnimationFrame((t) => updateGame(t));
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, updateGame]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 select-none touch-none">
      <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-2xl p-3 border border-border shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl ${forestHealth < 30 ? 'bg-red-100 animate-pulse' : 'bg-green-100'}`}>
                <TreePine className={`h-6 w-6 ${forestHealth < 30 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div className="flex flex-col w-32 sm:w-48 gap-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Forest Health</span>
                    <span>{Math.ceil(forestHealth)}%</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-black/5">
                    <div 
                        className={`h-full transition-all duration-300 ease-out ${forestHealth > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-600 to-orange-500'}`} 
                        style={{ width: `${Math.max(0, forestHealth)}%` }}
                    />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 px-4 py-1.5 rounded-full font-mono font-bold text-primary border border-primary/20 shadow-inner">
                {score}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                <X className="h-5 w-5" />
            </Button>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseDown={handleInputStart}
        onMouseUp={handleInputEnd}
        onMouseLeave={handleInputEnd}
        onTouchStart={handleInputStart}
        onTouchEnd={handleInputEnd}
        className="relative h-[450px] w-full bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-50 rounded-[2rem] border-[6px] border-white/50 shadow-2xl overflow-hidden cursor-none touch-none isolate group"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
        <div className="absolute bottom-16 left-[-20px] text-emerald-800/20 blur-[1px]"><TreePine className="h-32 w-32" /></div>
        <div className="absolute bottom-24 right-[-10px] text-emerald-800/10 blur-[2px]"><TreePine className="h-48 w-48" /></div>
        <div className="absolute top-10 right-10 text-white/30 animate-pulse duration-[3000ms]"><Wind className="h-20 w-20" /></div>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md z-40 p-6 text-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-6 max-w-sm mx-auto border border-white/50">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-sky-500 shadow-inner">
                    <CloudRain className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Cloud Keeper</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Extinguish <span className="text-orange-500 font-bold">Fires</span>. Water <span className="text-green-600 font-bold">Sprouts</span>.
                    </p>
                </div>
                <Button size="lg" onClick={startGame} className="w-full rounded-2xl text-lg h-16 bg-sky-500 hover:bg-sky-400 shadow-lg hover:shadow-sky-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                    <Play className="h-6 w-6 mr-2 fill-current" /> Start Mission
                </Button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-40 p-6 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-4 border-white w-full max-w-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100 opacity-50" />
                
              <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6 drop-shadow-md animate-bounce relative z-10" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-800 mb-2">Forest Secured!</h3>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-blue-600 mb-2 tracking-tighter">{score}</div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-8">Conservation Score</p>
              </div>
              
              <div className="grid gap-3 relative z-10">
                <Button onClick={startGame} size="lg" className="rounded-xl h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
                  <RotateCw className="h-5 w-5 mr-2" /> Play Again
                </Button>
                <Button variant="ghost" onClick={onClose} size="lg" className="rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-100">
                  Return to Menu
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-b-[1.5rem] border-t-8 border-emerald-400 shadow-inner z-10" />

        {objects.map(obj => (
            <div 
                key={obj.id}
                className="absolute bottom-16 transition-transform duration-75 flex flex-col items-center will-change-transform"
                style={{ 
                    left: `${obj.x}%`, 
                    transform: `translateX(-50%) scale(${obj.scale})`,
                    zIndex: 20
                }}
            >
                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity duration-200 ${obj.isWatered ? 'opacity-100' : 'opacity-0'}`}>
                    <Droplets className="h-6 w-6 text-blue-400 animate-bounce" />
                </div>

                {obj.type === 'fire' ? (
                    <div className="relative group">
                        <Flame className={`h-14 w-14 text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(255,165,0,0.6)] ${obj.isWatered ? 'animate-pulse scale-90' : 'animate-[wiggle_1s_ease-in-out_infinite]'}`} />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 blur-md rounded-full" />
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center justify-end h-28 origin-bottom">
                         {obj.health < 50 ? (
                            <Sprout className="h-10 w-10 text-lime-400 fill-lime-400 drop-shadow-sm" />
                         ) : (
                            <TreePine className="h-24 w-24 text-emerald-800 fill-emerald-800 drop-shadow-xl" />
                         )}
                         <div className="w-12 h-2 bg-black/30 rounded-full mt-2 overflow-hidden backdrop-blur-sm border border-white/10">
                            <div className="h-full bg-blue-400 transition-all duration-200" style={{ width: `${obj.health}%` }} />
                         </div>
                    </div>
                )}
            </div>
        ))}

        {particles.map((p) => (
            <div 
                key={p.id}
                className={`absolute rounded-full pointer-events-none ${p.type === 'rain' ? 'w-1 h-4 bg-blue-400/80 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'w-3 h-3 bg-gray-400/50 blur-sm'}`}
                style={{ 
                    left: `${p.x}%`, 
                    top: `${p.y}%`,
                    transform: p.type === 'rain' ? `rotate(${p.vx * 20}deg)` : 'scale(1.5)',
                    opacity: p.life
                }} 
            />
        ))}

        <div 
          className="absolute top-12 z-30 transition-transform duration-[50ms] ease-out will-change-transform pointer-events-none"
          style={{ left: `${cloudX}%`, transform: 'translateX(-50%)' }}
        >
          <div className={`relative transition-all duration-300 ${isRaining ? 'scale-110 translate-y-2 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]' : 'drop-shadow-lg'}`}>
             <Cloud className={`h-28 w-28 ${isRaining ? 'text-slate-500 fill-slate-600 stroke-slate-700' : 'text-white fill-white stroke-slate-200'}`} strokeWidth={1.5} />
             {isRaining && (
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    <div className="w-16 h-8 bg-blue-400/20 blur-xl rounded-full" />
                 </div>
             )}
          </div>
        </div>
      </div>
      
      <p className="text-center text-muted-foreground text-sm font-medium animate-pulse">
        Hold <span className="font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-md mx-1">Left Click</span> or <span className="font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-md mx-1">Touch</span> to Rain!
      </p>
    </div>
  );
};

export default ForestGame;