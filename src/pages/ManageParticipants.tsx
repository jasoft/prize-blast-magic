import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Users, UserPlus } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  student_id: string;
}

const ManageParticipants = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("哎呀，加载失败了 😢");
      return;
    }

    setParticipants(data || []);
  };

  const addParticipant = async () => {
    if (!name.trim() || !studentId.trim()) {
      toast.error("别忘了填写姓名和学号哦 📝");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("participants")
      .insert([{ name: name.trim(), student_id: studentId.trim() }]);

    if (error) {
      toast.error("添加失败了，再试一次吧 😅");
    } else {
      toast.success("太棒了！添加成功 🎉");
      setName("");
      setStudentId("");
      fetchParticipants();
    }
    setLoading(false);
  };

  const deleteParticipant = async (id: string) => {
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("删除失败了 😢");
    } else {
      toast.success("已删除 ✅");
      fetchParticipants();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* 装饰性元素 */}
      <div className="absolute top-10 right-10 text-5xl animate-wiggle">📋</div>
      <div className="absolute bottom-20 left-10 text-5xl animate-float">✏️</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-2 border-primary hover:border-accent hover:bg-accent hover:text-white font-bold text-lg"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          返回首页
        </Button>

        <div className="text-center mb-8 animate-float">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Users className="h-14 w-14 text-primary animate-bounce-fun" strokeWidth={2.5} />
            <h1 className="text-5xl md:text-6xl font-bold rainbow-text font-fredoka">
              管理名单
            </h1>
            <Users className="h-14 w-14 text-accent animate-bounce-fun" strokeWidth={2.5} />
          </div>
          <p className="text-2xl text-muted-foreground font-comic">
            现在有 <span className="text-primary font-bold text-3xl">{participants.length}</span> 位小伙伴参加 🎊
          </p>
        </div>

        <Card className="p-8 mb-8 bg-white shadow-fun border-4 border-secondary/50">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-8 w-8 text-secondary" strokeWidth={2.5} />
            <h2 className="text-3xl font-bold text-secondary font-fredoka">添加新伙伴</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="输入姓名 👤"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg border-2 border-primary/30 focus:border-primary font-comic h-14"
            />
            <Input
              placeholder="输入学号 🔢"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="text-lg border-2 border-primary/30 focus:border-primary font-comic h-14"
            />
            <Button
              onClick={addParticipant}
              disabled={loading}
              className="fun-gradient text-white font-bold text-lg h-14 hover:shadow-strong"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              添加
            </Button>
          </div>
        </Card>

        <Card className="p-8 bg-white shadow-fun border-4 border-primary/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">👥</span>
            <h2 className="text-3xl font-bold text-primary font-fredoka">参加的小伙伴</h2>
          </div>
          {participants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-4">😊</p>
              <p className="text-xl text-muted-foreground font-comic">还没有小伙伴加入呢，快来添加吧！</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/20 hover:border-primary/50 hover:shadow-fun transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-xl text-foreground font-fredoka">{participant.name}</p>
                      <p className="text-sm text-muted-foreground font-comic">学号: {participant.student_id}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteParticipant(participant.id)}
                    variant="destructive"
                    size="icon"
                    className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageParticipants;
