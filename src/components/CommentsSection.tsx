"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, CornerDownLeft, X } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  setDoc,
  doc,
  increment,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

interface CommentsSectionProps {
  articleId: number;
  initialCommentsCount: number;
}

interface FirestoreComment {
  id: string;
  author: string;
  content: string;
  createdAt: any;
  likes: number;
  dislikes: number;
  parentId?: string | null;
}

export function CommentsSection({ articleId, initialCommentsCount }: CommentsSectionProps) {
  const [comments, setComments] = useState<FirestoreComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");

  // Local vote tracking to prevent double liking/disliking
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [dislikedComments, setDislikedComments] = useState<Record<string, boolean>>({});

  // Format Hebrew timestamps
  const formatHebrewTime = (createdAt: any): string => {
    if (!createdAt) return "כרגע";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);
    const days = Math.floor(hrs / 24);

    if (min < 1) return "לפני פחות מדקה";
    if (min === 1) return "לפני דקה";
    if (min === 2) return "לפני 2 דקות";
    if (min < 60) return `לפני ${min} דקות`;
    if (hrs === 1) return "לפני שעה";
    if (hrs === 2) return "לפני שעתיים";
    if (hrs < 24) return `לפני ${hrs} שעות`;
    if (days === 1) return "אתמול";
    if (days === 2) return "לפני יומיים";
    return `לפני ${days} ימים`;
  };

  // Avatar background colors generated deterministically
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-[#fcc43c] text-white", // Yellow/Orange
      "bg-[#b07dff] text-white", // Purple/Violet
      "bg-[#f43f5e] text-white", // Rose
      "bg-[#38bdf8] text-white", // Sky
      "bg-[#10b981] text-white", // Emerald
      "bg-[#6366f1] text-white", // Indigo
    ];
    let sum = 0;
    const sanitized = name.trim() || "?";
    for (let i = 0; i < sanitized.length; i++) {
      sum += sanitized.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  // 1. Fetch Comments in Real-time from Firestore
  useEffect(() => {
    const commentsRef = collection(db, "articles", String(articleId), "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments: FirestoreComment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedComments.push({
          id: docSnap.id,
          author: data.author || "אנונימי",
          content: data.content || "",
          createdAt: data.createdAt,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          parentId: data.parentId || null,
        });
      });
      // Sort comments so that replies are grouped with parents
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error fetching comments from Firestore:", error);
    });

    // Load voter state & saved username
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("n18_commenter_name");
      if (storedName) {
        setAuthorName(storedName);
        setReplyName(storedName);
      }
      const storedLikes = localStorage.getItem(`n18_likes_${articleId}`);
      const storedDislikes = localStorage.getItem(`n18_dislikes_${articleId}`);
      if (storedLikes) setLikedComments(JSON.parse(storedLikes));
      if (storedDislikes) setDislikedComments(JSON.parse(storedDislikes));
    }

    return () => unsubscribe();
  }, [articleId]);

  // Save nickname helper
  const saveNickname = (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("n18_commenter_name", name);
    }
  };

  // 2. Add a new main comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const finalName = authorName.trim() || "יהודי פשוט";
    saveNickname(finalName);

    try {
      const commentsRef = collection(db, "articles", String(articleId), "comments");
      await addDoc(commentsRef, {
        author: finalName,
        content: newCommentText.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        parentId: null,
      });

      // Update comments count in parent article document
      const articleRef = doc(db, "articles", String(articleId));
      await setDoc(articleRef, {
        commentsCount: increment(1),
      }, { merge: true });

      setNewCommentText("");
      setIsFocused(false);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // 3. Add a reply to a comment
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const finalName = replyName.trim() || "מגיב";
    saveNickname(finalName);

    try {
      const commentsRef = collection(db, "articles", String(articleId), "comments");
      await addDoc(commentsRef, {
        author: finalName,
        content: replyText.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        parentId: parentId,
      });

      // Update comments count in parent article document
      const articleRef = doc(db, "articles", String(articleId));
      await setDoc(articleRef, {
        commentsCount: increment(1),
      }, { merge: true });

      setReplyText("");
      setActiveReplyId(null);
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  // 4. Handle comment likes
  const handleLikeComment = async (commentId: string) => {
    const commentRef = doc(db, "articles", String(articleId), "comments", commentId);
    const hasLiked = likedComments[commentId];
    const hasDisliked = dislikedComments[commentId];

    let likesDiff = 0;
    let dislikesDiff = 0;

    if (hasLiked) {
      // Undo like
      likesDiff = -1;
      const updatedLikes = { ...likedComments };
      delete updatedLikes[commentId];
      setLikedComments(updatedLikes);
      localStorage.setItem(`n18_likes_${articleId}`, JSON.stringify(updatedLikes));
    } else {
      // Do like
      likesDiff = 1;
      const updatedLikes = { ...likedComments, [commentId]: true };
      setLikedComments(updatedLikes);
      localStorage.setItem(`n18_likes_${articleId}`, JSON.stringify(updatedLikes));

      if (hasDisliked) {
        // Remove dislike if present
        dislikesDiff = -1;
        const updatedDislikes = { ...dislikedComments };
        delete updatedDislikes[commentId];
        setDislikedComments(updatedDislikes);
        localStorage.setItem(`n18_dislikes_${articleId}`, JSON.stringify(updatedDislikes));
      }
    }

    try {
      const updates: Record<string, any> = {};
      if (likesDiff !== 0) updates.likes = increment(likesDiff);
      if (dislikesDiff !== 0) updates.dislikes = increment(dislikesDiff);
      await updateDoc(commentRef, updates);
    } catch (err) {
      console.error("Failed to update comment likes:", err);
    }
  };

  // 5. Handle comment dislikes
  const handleDislikeComment = async (commentId: string) => {
    const commentRef = doc(db, "articles", String(articleId), "comments", commentId);
    const hasLiked = likedComments[commentId];
    const hasDisliked = dislikedComments[commentId];

    let likesDiff = 0;
    let dislikesDiff = 0;

    if (hasDisliked) {
      // Undo dislike
      dislikesDiff = -1;
      const updatedDislikes = { ...dislikedComments };
      delete updatedDislikes[commentId];
      setDislikedComments(updatedDislikes);
      localStorage.setItem(`n18_dislikes_${articleId}`, JSON.stringify(updatedDislikes));
    } else {
      // Do dislike
      dislikesDiff = 1;
      const updatedDislikes = { ...dislikedComments, [commentId]: true };
      setDislikedComments(updatedDislikes);
      localStorage.setItem(`n18_dislikes_${articleId}`, JSON.stringify(updatedDislikes));

      if (hasLiked) {
        // Remove like if present
        likesDiff = -1;
        const updatedLikes = { ...likedComments };
        delete updatedLikes[commentId];
        setLikedComments(updatedLikes);
        localStorage.setItem(`n18_likes_${articleId}`, JSON.stringify(updatedLikes));
      }
    }

    try {
      const updates: Record<string, any> = {};
      if (likesDiff !== 0) updates.likes = increment(likesDiff);
      if (dislikesDiff !== 0) updates.dislikes = increment(dislikesDiff);
      await updateDoc(commentRef, updates);
    } catch (err) {
      console.error("Failed to update comment dislikes:", err);
    }
  };

  // Filter main comments and replies
  const mainComments = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  // Group replies by parentId
  const repliesMap = replies.reduce<Record<string, FirestoreComment[]>>((acc, reply) => {
    if (reply.parentId) {
      if (!acc[reply.parentId]) acc[reply.parentId] = [];
      // Show older replies first
      acc[reply.parentId].push(reply);
    }
    return acc;
  }, {});

  // Sort replies under each comment by creation time ascending
  Object.keys(repliesMap).forEach((parentId) => {
    repliesMap[parentId].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return aTime - bTime;
    });
  });

  return (
    <div className="w-full mt-10 border-t border-slate-100 pt-8" dir="rtl">
      {/* Header with Comments speech bubble badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative bg-[#0c1840] text-white font-extrabold text-[15px] px-2.5 py-1 rounded-md min-w-[34px] h-8 flex items-center justify-center after:content-[''] after:absolute after:bottom-[-4.5px] after:left-[8.5px] after:w-2.5 after:h-2.5 after:bg-[#0c1840] after:rotate-45 after:rounded-xs shadow-xs select-none">
            {comments.length}
          </div>
          <h2 className="text-[22px] font-black text-[#0c1840]">תגובות</h2>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-100 mb-4" />

      {/* Dynamic Subtitle */}
      <p className="text-[14px] text-slate-500 font-medium mb-5 select-none leading-none">
        נא שימרו על שפה נקייה אשר מכבדת אתכם
      </p>

      {/* 2. Main Comment Write Box */}
      <form onSubmit={handleSubmitComment} className="mb-8 select-none">
        <div className="relative w-full flex items-center bg-[#f4f6fa] rounded-full border border-slate-100 focus-within:border-slate-200 focus-within:bg-white transition-all pl-2.5 shadow-xs">
          {/* Custom Left Arrowhead Send Icon */}
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className={`p-2.5 bg-transparent rounded-full hover:bg-slate-100/50 transition-all flex items-center justify-center ${
              newCommentText.trim() ? "text-[#0c1840] scale-105 cursor-pointer" : "text-slate-300 cursor-not-allowed"
            }`}
            title="פרסום תגובה"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 3L2 12l19 9-4-9 4-9z" />
            </svg>
          </button>
          
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="כתיבת תגובה"
            className="flex-1 bg-transparent border-0 outline-none text-right py-3.5 pr-5 text-[15px] font-semibold text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Expandable Nickname fields when focused */}
        {isFocused && (
          <div className="mt-3 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-250">
            <div className="w-full sm:w-2/3 flex flex-col gap-1">
              <label className="text-[12px] font-bold text-slate-500 pr-1">שם פרטי / כינוי:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="יהודי פשוט"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[14px] font-bold text-slate-800 outline-none focus:border-slate-300"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0">
              <button
                type="button"
                onClick={() => setIsFocused(false)}
                className="px-4 py-2 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-5 py-2 bg-[#0c1840] hover:bg-[#1a295c] text-white font-extrabold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                פרסום תגובה
              </button>
            </div>
          </div>
        )}
      </form>

      {/* 3. Comments List */}
      <div className="space-y-6">
        {mainComments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-semibold select-none">
            אין עדיין תגובות לכתבה זו. תהיו הראשונים להגיב!
          </div>
        ) : (
          mainComments.map((comment) => {
            const commentReplies = repliesMap[comment.id] || [];
            const isReplying = activeReplyId === comment.id;

            return (
              <div key={comment.id} className="border-b border-slate-100 pb-5 last:border-0">
                {/* Main Comment */}
                <div className="flex gap-4 items-start text-right">
                  {/* Deterministic User Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 select-none ${getAvatarColor(comment.author)} shadow-xs`}>
                    {comment.author.trim().charAt(0)}
                  </div>

                  {/* Comment Bubble Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-slate-900 leading-tight">
                        {comment.author}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold mt-1 select-none">
                        {formatHebrewTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-[15px] sm:text-base text-slate-800 font-normal leading-relaxed mt-2.5 break-words whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Likes & Dislikes counters */}
                      <div className="flex items-center gap-4 text-slate-400 select-none">
                        {/* Like */}
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1.5 transition-colors hover:text-green-600 ${
                            likedComments[comment.id] ? "text-green-600 font-extrabold" : ""
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${likedComments[comment.id] ? "fill-green-600" : ""}`} />
                          <span className="text-[13px] font-sans font-bold">{comment.likes}</span>
                        </button>

                        {/* Dislike */}
                        <button
                          onClick={() => handleDislikeComment(comment.id)}
                          className={`flex items-center gap-1.5 transition-colors hover:text-red-500 ${
                            dislikedComments[comment.id] ? "text-red-500 font-extrabold" : ""
                          }`}
                        >
                          <ThumbsDown className={`w-4 h-4 ${dislikedComments[comment.id] ? "fill-red-500" : ""}`} />
                          <span className="text-[13px] font-sans font-bold">{comment.dislikes}</span>
                        </button>
                      </div>

                      {/* Reply Button pill */}
                      <button
                        onClick={() => {
                          setActiveReplyId(isReplying ? null : comment.id);
                          setReplyText("");
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[12px] py-1 px-4.5 rounded-full transition-colors flex items-center justify-center select-none"
                      >
                        <span>הגב</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Write Form (Inline under the parent comment) */}
                {isReplying && (
                  <form
                    onSubmit={(e) => handleSubmitReply(e, comment.id)}
                    className="mr-12 sm:mr-14 mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between mb-2 select-none">
                      <span className="text-xs font-bold text-slate-500">תגובה ל-{comment.author}</span>
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="כתיבת תגובה..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[14px] font-semibold text-slate-800 outline-none focus:border-slate-300 resize-none h-20"
                    />

                    <div className="mt-3 flex flex-col sm:flex-row gap-3 items-center justify-between select-none">
                      <div className="w-full sm:w-1/2 flex flex-col gap-1">
                        <input
                          type="text"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          placeholder="שמך לתצוגה"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-[13px] font-bold text-slate-800 outline-none focus:border-slate-300"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="w-full sm:w-auto px-4 py-1.5 bg-[#0c1840] hover:bg-[#1a295c] text-white font-extrabold text-[13px] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        שלח תגובה
                      </button>
                    </div>
                  </form>
                )}

                {/* Render Replies (indented list) */}
                {commentReplies.length > 0 && (
                  <div className="mr-12 sm:mr-14 mt-4 space-y-4 border-r-2 border-slate-100 pr-3 sm:pr-4">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 items-start text-right">
                        {/* Deterministic User Avatar for Reply */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-[13px] flex-shrink-0 select-none ${getAvatarColor(reply.author)} shadow-xs`}>
                          {reply.author.trim().charAt(0)}
                        </div>

                        {/* Reply Bubble Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-900 leading-tight">
                              {reply.author}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5 select-none">
                              {formatHebrewTime(reply.createdAt)}
                            </span>
                          </div>

                          <p className="text-[14px] text-slate-800 font-semibold leading-relaxed mt-1.5 break-words whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          {/* Reply Actions (Likes / Dislikes) */}
                          <div className="flex items-center gap-3.5 mt-2 text-slate-400 select-none">
                            {/* Like */}
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className={`flex items-center gap-1 transition-colors hover:text-green-600 ${
                                likedComments[reply.id] ? "text-green-600 font-extrabold" : ""
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${likedComments[reply.id] ? "fill-green-600" : ""}`} />
                              <span className="text-[11px] font-sans font-bold">{reply.likes}</span>
                            </button>

                            {/* Dislike */}
                            <button
                              onClick={() => handleDislikeComment(reply.id)}
                              className={`flex items-center gap-1 transition-colors hover:text-red-500 ${
                                dislikedComments[reply.id] ? "text-red-500 font-extrabold" : ""
                              }`}
                            >
                              <ThumbsDown className={`w-3.5 h-3.5 ${dislikedComments[reply.id] ? "fill-red-500" : ""}`} />
                              <span className="text-[11px] font-sans font-bold">{reply.dislikes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
