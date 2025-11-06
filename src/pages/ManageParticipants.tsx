import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";

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
      toast.error("加载失败");
      return;
    }

    setParticipants(data || []);
  };

  const addParticipant = async () => {
    if (!name.trim() || !studentId.trim()) {
      toast.error("请填写完整信息");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("participants")
      .insert([{ name: name.trim(), student_id: studentId.trim() }]);

    if (error) {
      toast.error("添加失败");
    } else {
      toast.success("添加成功");
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
      toast.error("删除失败");
    } else {
      toast.success("删除成功");
      fetchParticipants();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-primary/50 hover:border-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gold-text mb-4 flex items-center justify-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            参与者管理
          </h1>
          <p className="text-muted-foreground">
            当前共有 <span className="text-primary font-bold text-xl">{participants.length}</span> 人参与抽奖
          </p>
        </div>

        <Card className="p-6 mb-6 bg-card/80 backdrop-blur border-primary/30">
          <h2 className="text-2xl font-bold gold-text mb-4">添加参与者</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-primary/30 focus:border-primary"
            />
            <Input
              placeholder="学号"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-background/50 border-primary/30 focus:border-primary"
            />
            <Button
              onClick={addParticipant}
              disabled={loading}
              className="gold-gradient font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              添加
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <h2 className="text-2xl font-bold gold-text mb-4">参与者列表</h2>
          {participants.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">暂无参与者</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-lg">{participant.name}</p>
                    <p className="text-sm text-muted-foreground">学号: {participant.student_id}</p>
                  </div>
                  <Button
                    onClick={() => deleteParticipant(participant.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
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
