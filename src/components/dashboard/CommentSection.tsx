
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId, comments: initialComments }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
  const { toast } = useToast();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Você",
      date: new Date().toLocaleDateString("pt-BR"),
      text: newComment
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    
    toast({
      title: "Comentário adicionado",
      description: isWhatsAppEnabled 
        ? "Sua mensagem foi enviada e notificações serão enviadas via WhatsApp"
        : "Sua mensagem foi enviada com sucesso",
    });
  };

  const handleWhatsAppToggle = () => {
    setIsWhatsAppEnabled(!isWhatsAppEnabled);
    
    toast({
      title: isWhatsAppEnabled 
        ? "Notificações WhatsApp desativadas"
        : "Notificações WhatsApp ativadas",
      description: isWhatsAppEnabled
        ? "Você não receberá mais notificações pelo WhatsApp"
        : "Você receberá notificações por WhatsApp",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div>
      <h3 className="font-medium mb-4">Comentários ({comments.length})</h3>
      
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs">
                  {getInitials(comment.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleCommentSubmit}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="mb-3"
          rows={3}
        />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="whatsapp-toggle"
              checked={isWhatsAppEnabled}
              onChange={handleWhatsAppToggle}
              className="mr-2"
            />
            <label htmlFor="whatsapp-toggle" className="text-xs">
              Enviar notificação via WhatsApp
            </label>
          </div>
          
          <Button type="submit" size="sm">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
