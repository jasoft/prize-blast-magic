import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Sparkles, Star, Smile } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* 装饰性元素 */}
        <div className="absolute top-10 left-10 text-6xl animate-wiggle">🎈</div>
        <div className="absolute top-20 right-20 text-6xl animate-bounce-fun">⭐</div>
        <div className="absolute bottom-20 left-20 text-6xl animate-float">🎉</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-wiggle">🎊</div>

        <div className="text-center mb-12 animate-float">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Star className="h-16 w-16 text-accent animate-rainbow-spin" fill="currentColor" />
            <div className="text-8xl animate-wiggle">🎲</div>
            <Star className="h-16 w-16 text-secondary animate-rainbow-spin" fill="currentColor" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold rainbow-text mb-4 font-fredoka">
            幸运大转盘
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Smile className="h-8 w-8 text-primary" />
            <p className="text-3xl font-bold text-primary">
              谁是今天的幸运儿？
            </p>
            <Smile className="h-8 w-8 text-accent" />
          </div>
          <p className="text-xl text-muted-foreground font-comic">
            快来试试你的运气吧！✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <Card
            className="p-10 bg-white hover:shadow-strong transition-all hover:scale-105 cursor-pointer group border-4 border-primary/30 hover:border-primary shine-effect"
            onClick={() => navigate("/manage")}
          >
            <div className="text-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 blur-2xl opacity-40 bg-primary/50 rounded-full group-hover:opacity-60 transition-opacity animate-pulse" />
                <Users className="h-24 w-24 mx-auto text-primary relative group-hover:scale-110 transition-transform animate-bounce-fun" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-bold text-primary mb-3 font-fredoka">管理名单</h2>
              <p className="text-muted-foreground text-lg font-comic">
                添加或删除参与抽奖的小伙伴
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="text-3xl">👥</span>
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </Card>

          <Card
            className="p-10 fun-gradient hover:shadow-strong transition-all hover:scale-105 cursor-pointer group border-4 border-accent shine-effect"
            onClick={() => navigate("/lottery")}
          >
            <div className="text-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 blur-2xl opacity-50 bg-white/50 rounded-full group-hover:opacity-70 transition-opacity animate-pulse" />
                <Sparkles className="h-24 w-24 mx-auto text-white relative group-hover:scale-110 transition-transform animate-wiggle" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3 font-fredoka drop-shadow-lg">开始抽奖</h2>
              <p className="text-white/90 text-lg font-bold font-comic drop-shadow">
                让我们一起见证激动人心的时刻！
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="text-3xl animate-bounce-fun">🎯</span>
                <span className="text-3xl animate-wiggle">🏆</span>
                <span className="text-3xl animate-bounce-fun">🎁</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 text-primary text-xl font-comic font-bold">
            <span className="text-2xl animate-bounce-fun">🍀</span>
            <span>祝你好运！</span>
            <span className="text-2xl animate-bounce-fun">🍀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
