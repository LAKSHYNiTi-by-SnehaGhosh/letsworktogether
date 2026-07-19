import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/lib/store/office-state";
import { BookOpen, Search, Clock } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  content: string;
  updatedAt: string;
  author?: {
    profile?: {
      firstName: string;
      lastName: string;
    }
  }
}

export function DocumentationLibrary() {
  const activeProjectId = useOfficeStore(state => state.activeProjectId);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      if (!activeProjectId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/documents?projectId=${activeProjectId}`);
        if (res.ok) setDocs(await res.json());
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchDocs();
  }, [activeProjectId]);

  const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-[600px] max-h-[700px] overflow-y-auto bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl p-6 pointer-events-auto">
      <div className="flex items-center gap-2 mb-4 border-b pb-4">
        <BookOpen className="text-primary" />
        <h2 className="text-2xl font-bold">Documentation Library</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search documents, architecture, APIs..."
          className="w-full bg-muted pl-10 pr-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-muted rounded-lg w-full"></div>
          <div className="h-16 bg-muted rounded-lg w-full"></div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No documents found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-4 border rounded-lg bg-card hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{doc.title}</h3>
                <span className="text-xs px-2 py-1 rounded bg-secondary">{doc.type}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{doc.content}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                {doc.author && (
                  <span className="ml-4">• By {doc.author.profile?.firstName} {doc.author.profile?.lastName}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
