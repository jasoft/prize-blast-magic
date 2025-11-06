-- 创建参与者表
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 启用 RLS（因为这是公开抽奖，允许所有人读取）
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看参与者
CREATE POLICY "Anyone can view participants" 
ON public.participants 
FOR SELECT 
USING (true);

-- 允许所有人插入参与者（用于管理）
CREATE POLICY "Anyone can insert participants" 
ON public.participants 
FOR INSERT 
WITH CHECK (true);

-- 允许所有人删除参与者（用于管理）
CREATE POLICY "Anyone can delete participants" 
ON public.participants 
FOR DELETE 
USING (true);

-- 创建抽奖历史表
CREATE TABLE public.lottery_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  winner_name TEXT NOT NULL,
  winner_student_id TEXT NOT NULL,
  drawn_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 启用 RLS
ALTER TABLE public.lottery_history ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看历史
CREATE POLICY "Anyone can view lottery history" 
ON public.lottery_history 
FOR SELECT 
USING (true);

-- 允许所有人插入历史记录
CREATE POLICY "Anyone can insert lottery history" 
ON public.lottery_history 
FOR INSERT 
WITH CHECK (true);