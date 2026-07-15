import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    try {
      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const res = await api.get(`/questions${statusParam}`);
      setQuestions(res.data);
    } catch (err) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answer.trim()) {
      toast.error("Please write an answer");
      return;
    }

    setAnswering(true);
    try {
      await api.put(`/questions/${questionId}/answer`, {
        answer: answer.trim(),
        isPublic: true,
      });
      toast.success("✅ Question answered!");
      setSelectedQuestion(null);
      setAnswer("");
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to answer");
    } finally {
      setAnswering(false);
    }
  };

  const handleDelete = async (id, subject) => {
    if (!confirm(`Delete question "${subject}"?`)) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success("Question deleted");
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading questions...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">
          📬 Questions ({questions.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-sm ${filter === "all" ? "bg-burgundy text-white" : "bg-ink/5 hover:bg-ink/10"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unanswered")}
            className={`px-3 py-1 rounded-lg text-sm ${filter === "unanswered" ? "bg-burgundy text-white" : "bg-ink/5 hover:bg-ink/10"}`}
          >
            Unanswered
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`px-3 py-1 rounded-lg text-sm ${filter === "answered" ? "bg-burgundy text-white" : "bg-ink/5 hover:bg-ink/10"}`}
          >
            Answered
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 text-ink/40">
          <div className="text-6xl mb-4">📭</div>
          <p>No questions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q._id} className="magazine-card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif font-bold">{q.subject}</h3>
                    {q.isAnswered ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        ✅ Answered
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink/60 mt-1 line-clamp-2">
                    {q.question}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-ink/40">
                    <span>👤 {q.name}</span>
                    <span>📧 {q.email}</span>
                    <span>📂 {q.category}</span>
                    <span>
                      🕐{" "}
                      {formatDistanceToNow(new Date(q.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {q.isAnswered && q.answer && (
                    <div className="mt-3 bg-cream p-3 rounded-lg">
                      <p className="text-sm font-serif font-semibold text-burgundy">
                        💡 Answer:
                      </p>
                      <p className="text-sm text-ink/70">{q.answer}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedQuestion(q._id)}
                    className="p-2 text-burgundy hover:bg-burgundy/10 rounded-lg transition-colors"
                    title="Answer question"
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id, q.subject)}
                    className="p-2 text-ink/30 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete question"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Answer form */}
              {selectedQuestion === q._id && (
                <div className="mt-4 border-t border-gold/20 pt-4">
                  <div className="flex gap-3">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={
                        q.isAnswered
                          ? "Edit your answer..."
                          : "Write your answer..."
                      }
                      rows={3}
                      className="flex-1 px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAnswer(q._id)}
                      disabled={answering}
                      className="bg-burgundy text-white px-4 py-1 rounded-lg text-sm hover:bg-burgundy/90 transition-colors disabled:opacity-50"
                    >
                      {answering
                        ? "Saving..."
                        : q.isAnswered
                          ? "Update Answer"
                          : "Submit Answer"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestion(null);
                        setAnswer("");
                      }}
                      className="border border-ink/20 px-4 py-1 rounded-lg text-sm hover:bg-ink/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
