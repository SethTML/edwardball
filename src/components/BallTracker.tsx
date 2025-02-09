"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CONFETTI_COLORS = ["#FF00FF", "#00FFFF", "#FF3333", "#33FF33", "#FFFF00"];
const CONFETTI_COUNT = 150; // Increased confetti

const Confetti = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      color: string;
      scale: number;
      speed: number;
    }>
  >([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: CONFETTI_COUNT }).map(
        (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 40,
          rotation: Math.random() * 360,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          scale: 0.5 + Math.random() * 0.5,
          speed: 2 + Math.random() * 2,
        }),
      );
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 transform rotate-45"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            backgroundColor: particle.color,
            transition: "all 1s linear",
            animation: "fall 2s linear forwards",
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg);
          }
        }
      `}</style>
    </div>
  );
};

const ScoreDisplay = ({ score }: { score: number }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse" />
      <Card className="relative border-2 border-purple-500 bg-black/80 overflow-hidden">
        <CardContent className="pt-6 pb-8">
          <div className="text-center space-y-2">
            <Trophy className="w-12 h-12 mx-auto text-yellow-400 animate-bounce" />
            <div className="text-6xl font-bold text-purple-500 animate-glow">
              {score}
            </div>
            <div className="text-sm text-cyan-400 uppercase tracking-widest">
              All-Time Successful Entries
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-gradient" />
      </Card>
    </div>
  );
};

type StatusInfo = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const CyberpunkBallTracker = () => {
  const [status, setStatus] = useState<"waiting" | "entry" | "exit">("waiting");
  const [confidence, setConfidence] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [successes, setSuccesses] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  console.log(confidence);

  useEffect(() => {
    alert("~ SethTML: everything deployed on this site was directly pulled from edward's original github repository. I just deployed it onto a website. https://github.com/edwardwc/balltrackerfrontend");
  }, []);

  useEffect(() => {
    setMounted(true);
    const ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status_change") {
        setStatus(data.status);
        setConfidence(data.confidence);

        if (data.status === "entry") {
          setShowConfetti(true);
          setSuccesses((prev) => prev + 1);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    };

    return () => ws.close();
  }, []);

  if (!mounted) {
    return null;
  }

  const getStatusDisplay = (): StatusInfo => {
    switch (status) {
      case "entry":
        return {
          title: "🎯 DROP DETECTED! 🎯",
          description: "TARGET ACQUIRED - PERFECT SHOT!",
          icon: (
            <CheckCircle2 className="h-8 w-8 text-green-500 animate-pulse" />
          ),
          color: "border-green-500",
        };
      case "exit":
        return {
          title: "SYSTEM CLEAR",
          description: "Ready for next attempt. SPEED!",
          icon: <AlertCircle className="h-8 w-8 text-blue-500" />,
          color: "border-blue-500",
        };
      default:
        return {
          title: "SYSTEM ACTIVE",
          description:
            "Monitoring target zone. Will you take the perfect shot?",
          icon: <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />,
          color: "border-yellow-500",
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-cyan-500 p-8 font-mono relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      <Confetti active={showConfetti} />

      <div className="max-w-4xl mx-auto space-y-8 relative">
        {/* Title card with animated border */}
        <Card className="border-2 border-cyan-500 bg-black/80 backdrop-blur relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 tracking-wider">
              2077 Ballistic Tracker
            </CardTitle>
            <CardDescription className="text-center">
              Powered by v8
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Status display */}
        <Alert
          className={`border-2 ${statusInfo.color} bg-black/80 backdrop-blur transition-all duration-500`}
        >
          <div className="flex items-center gap-4">
            {statusInfo.icon}
            <div>
              <AlertTitle className="text-2xl font-bold tracking-wide animate-glow">
                {statusInfo.title}
              </AlertTitle>
              <AlertDescription className="text-lg opacity-80">
                {statusInfo.description}
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Score display */}
        <ScoreDisplay score={successes} />

        {/* Connection status with animated ring */}
        <div className="flex items-center gap-3 justify-center">
          <div
            className={`w-4 h-4 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} relative`}
          >
            <div
              className={`absolute inset-0 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} animate-ping`}
            />
          </div>
          <span className="text-lg tracking-wider">
            {connected ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px currentColor;
          }
          50% {
            text-shadow: 0 0 10px currentColor;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-gradient {
          animation: gradient 3s linear infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default CyberpunkBallTracker;
