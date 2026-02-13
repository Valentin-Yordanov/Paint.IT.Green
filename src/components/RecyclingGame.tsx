import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Recycle, 
  Trash2, 
  Battery, 
  Apple, 
  X, 
  Trophy, 
  Play, 
  RotateCw, 
  Heart, 
  Banana, 
  FileText, 
  Box, 
  Cloud 
} from "lucide-react";

interface GameItem {
  id: number;
  x: number;
  y: number;
  type: 'good' | 'bad';
  icon: React.ElementType; // FIXED: Changed 'any' to 'React.ElementType'
  speed: number;
  rotation: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface RecyclingGameProps {
  onClose: () => void;
}

const RecyclingGame = ({ onClose }: RecyclingGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [items, setItems] = useState<GameItem[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [floaters, setFloaters] = useState<FloatingText[]>([]);
  const [shake, setShake] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setItems([]);
    setFloaters([]);
    setBasketX(50);
  };

  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Date.now();
    setFloaters(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    }, 800);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameAreaRef.current || !isPlaying || gameOver) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    
    let newX = ((clientX - rect.left) / rect.width) * 100;
    newX = Math.max(0, Math.min(100, newX));
    setBasketX(newX);
  };

  const updateGame = useCallback((time: number) => {
    if (gameOver || !isPlaying) return;

    const spawnRate = Math.max(500, 1200 - (score * 30));
    
    if (time - lastSpawnTime.current > spawnRate) {
      const isGood = Math.random() > 0.4;
      
      let icon = Recycle;
      if (isGood) {
         const goodIcons = [Recycle, FileText, Box];
         icon = goodIcons[Math.floor(Math.random() * goodIcons.length)];
      } else {
         const badIcons = [Apple, Banana, Battery];
         icon = badIcons[Math.floor(Math.random() * badIcons.length)];
      }

      const newItem: GameItem = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: -15,
        type: isGood ? 'good' : 'bad',
        icon: icon,
        speed: 0.4 + (score * 0.03),
        rotation: Math.random() * 360
      };
      setItems(prev => [...prev, newItem]);
      lastSpawnTime.current = time;
    }

    setItems(prevItems => {
      const newItems: GameItem[] = [];
      const basketHitbox = 12;

      // FIXED: Removed the unused 'currentLives' variable to fix linter warning
      
      for (const item of prevItems) {
        const nextY = item.y + item.speed;

        // Collision Logic
        if (nextY > 82 && nextY < 95) { 
          const dist = Math.abs(item.x - basketX);
          
          if (dist < basketHitbox) {
            if (item.type === 'good') {
              setScore(s => s + 1);
              spawnFloatingText(item.x, 80, "+1", "text-green-600");
            } else {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
              triggerShake();
              spawnFloatingText(item.x, 80, "-1", "text-red-600");
            }
            continue; 
          }
        }

        if (nextY > 105) continue; 

        newItems.push({ ...item, y: nextY, rotation: item.rotation + 1 });
      }
      return newItems;
    });

    requestRef.current = requestAnimationFrame((t) => updateGame(t));
  }, [basketX, gameOver, isPlaying, score]); // lives is handled via state setter

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame((t) => updateGame(t));
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, updateGame]);

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-4 transition-all duration-100 ${shake ? 'translate-x-[-5px] rotate-[-1deg]' : ''}`}>
      <div className="flex items-center justify-between bg-card/50 backdrop-blur rounded-2xl p-2 border border-border/50">
        <div className="flex items-center gap-4 pl-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Recycle className="h-5 w-5" /> Eco Hero
            </h2>
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`h-6 w-6 transition-all ${i < lives ? "fill-red-500 text-red-500" : "fill-gray-300 text-gray-300"}`} 
                    />
                ))}
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 px-3 py-1 rounded-full font-mono font-bold text-primary">
                Score: {score}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive rounded-full">
                <X className="h-5 w-5" />
            </Button>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className="relative h-[450px] w-full bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 rounded-[2rem] border-8 border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden cursor-none touch-none select-none isolate"
      >
        <div className="absolute top-10 left-10 text-white/40 animate-pulse"><Cloud className="h-16 w-16 fill-white" /></div>
        <div className="absolute top-20 right-20 text-white/30 animate-pulse delay-700"><Cloud className="h-12 w-12 fill-white" /></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-b-[1.5rem]" />
        
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md z-30 p-6 text-center animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl space-y-6 max-w-sm mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                    <Recycle className="h-10 w-10 animate-spin-slow" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Eco Sort!</h3>
                    <p className="text-slate-500 mt-2 font-medium">Catch the <span className="text-green-600">Recyclables</span>. Avoid the <span className="text-red-500">Trash</span>.</p>
                </div>
                <Button size="lg" onClick={startGame} className="w-full rounded-xl text-lg h-14 bg-green-600 hover:bg-green-700 shadow-green-200 shadow-xl hover:scale-105 transition-all">
                    <Play className="h-5 w-5 mr-2 fill-current" /> Play Now
                </Button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-30 p-6 animate-in zoom-in-95">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl text-center border-b-8 border-gray-200 w-full max-w-sm">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
              <h3 className="text-2xl font-black text-slate-800 mb-1">Great Job!</h3>
              <div className="text-5xl font-black text-green-500 mb-2">{score}</div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-6">Items Recycled</p>
              
              <div className="grid gap-3">
                <Button onClick={startGame} size="lg" className="rounded-xl h-12 text-lg font-bold">
                  <RotateCw className="h-5 w-5 mr-2" /> Play Again
                </Button>
                <Button variant="outline" onClick={onClose} size="lg" className="rounded-xl h-12 font-bold border-2">
                  Close Game
                </Button>
              </div>
            </div>
          </div>
        )}

        {items.map(item => (
          <div
            key={item.id}
            className="absolute z-10 will-change-transform"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
            }}
          >
            <div className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg border-4 ${item.type === 'good' ? 'bg-white border-green-400 text-green-600' : 'bg-white border-red-400 text-red-500'}`}>
              <item.icon className="h-7 w-7" />
            </div>
          </div>
        ))}

        {floaters.map(f => (
            <div key={f.id} className={`absolute font-black text-2xl animate-out fade-out slide-out-to-top-10 duration-700 ${f.color}`} style={{ left: `${f.x}%`, top: `${f.y}%` }}>
                {f.text}
            </div>
        ))}

        <div className="absolute bottom-5 z-20 transition-transform duration-75 ease-out will-change-transform" style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}>
          <div className="relative group">
             <div className="h-20 w-24 bg-green-600 rounded-b-2xl rounded-t-sm shadow-[0_10px_20px_rgba(0,100,0,0.3)] flex items-center justify-center border-b-4 border-r-4 border-green-800">
                <Recycle className="text-white/30 h-10 w-10" />
             </div>
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-green-700 rounded-full shadow-sm" />
             <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
      
      <p className="text-center text-muted-foreground text-sm font-medium">Use your mouse or finger to move the bin!</p>
    </div>
  );
};

export default RecyclingGame;