import { useState, useEffect } from "react";
import GoogleLogin from "./GoogleLogin";
import {
  verifyLogin,
  getVideoDetails,
  postComment,
  updateVideoMetadata,
  addNote,
  getNotes,
  deleteComment as deleteCommentAPI,
  getEventLogs,
} from "../api";

interface Comment {
  id: string;
  author: string;
  text: string;
  replies?: Comment[];
}

interface Note {
  id: string;
  content: string;
  updatedAt: string;
}

interface EventLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export default function VideoDashboardMock() {
  const [videoIdInput, setVideoIdInput] = useState("");
  const [videoId, setVideoId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        await verifyLogin();
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Login verification failed:", err);
      }

      try {
        if (!videoId) return;
        const videoData = await getVideoDetails(videoId);
        const details = videoData.items?.[0]?.snippet;
        if (details) {
          setTitle(details.title);
          setDescription(details.description);
        }

        const fetchedNotes = await getNotes(videoId);
        setNotes(fetchedNotes);

        const fetchedLogs = await getEventLogs();
        setEventLogs(fetchedLogs);
      } catch (err) {
        console.error("Error fetching video details, notes, or logs:", err);
      }
    };

    init();
  }, [videoId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const posted = await postComment(videoId, newComment);
      const comment: Comment = {
        id: posted.id || Math.random().toString(),
        author: posted.author || "You",
        text: posted.text || newComment,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleReply = (parentId: string) => {
    if (!replyText[parentId]?.trim()) return;
    const reply: Comment = {
      id: Math.random().toString(),
      author: "You",
      text: replyText[parentId],
    };
    const updated = comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : c
    );
    setComments(updated);
    setReplyText({ ...replyText, [parentId]: "" });
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteCommentAPI(id);
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const newNote = await addNote(videoId, noteText);
      setNotes([newNote, ...notes]);
      setNoteText("");
    } catch (err) {
      console.error("Failed to add note:", err);
      alert("Failed to add note.");
    }
  };

  const handleSaveMetadata = async () => {
    try {
      await updateVideoMetadata(videoId, { title, description });
      alert("Video metadata updated successfully!");
    } catch (err) {
      console.error("Failed to update metadata:", err);
      alert("Failed to update metadata.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to access the dashboard
          </h1>
          <GoogleLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md w-full px-4">
          <h1 className="text-xl font-semibold mb-4">
            Enter a YouTube Video ID
          </h1>
          <input
            className="w-full p-2 border rounded mb-4"
            placeholder="e.g. dQw4w9WgXcQ"
            value={videoIdInput}
            onChange={(e) => setVideoIdInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            onClick={() => setVideoId(videoIdInput)}
            disabled={!videoIdInput.trim()}
          >
            Load Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GoogleLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold">YouTube Dashboard</h1>

        {/* Video Player */}
        <div className="bg-white shadow p-4 rounded">
          <iframe
            className="w-full mb-4 rounded"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          />
          <div>
            <label className="font-semibold">Title</label>
            <input
              className="w-full p-2 border rounded mt-1 mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="font-semibold">Description</label>
            <textarea
              className="w-full p-2 border rounded mt-1 mb-3"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSaveMetadata}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Comments</h2>
          <div className="flex mb-4 gap-2">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handlePostComment}
            >
              Post
            </button>
          </div>
          {comments.map((comment) => (
            <div key={comment.id} className="border-b py-3">
              <p className="font-semibold">{comment.author}</p>
              <p>{comment.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  className="flex-1 p-1 border rounded"
                  placeholder="Reply..."
                  value={replyText[comment.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [comment.id]: e.target.value })
                  }
                />
                <button
                  className="text-blue-600"
                  onClick={() => handleReply(comment.id)}
                >
                  Reply
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
              <div className="ml-4 mt-2 space-y-2">
                {comment.replies?.map((reply) => (
                  <div key={reply.id}>
                    <p className="font-semibold text-sm">{reply.author}</p>
                    <p className="text-sm">{reply.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Your Notes</h2>
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Note to improve your video..."
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={handleAddNote}
          >
            Add Note
          </button>
          <ul className="mt-4 space-y-2">
            {notes.map((note) => (
              <li key={note.id} className="p-2 border rounded text-sm">
                {note.content}
                <p className="text-xs text-gray-500">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Logs */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Event Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Action</th>
                  <th className="p-2 border">Timestamp</th>
                  <th className="p-2 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {eventLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-2 border">{log.action}</td>
                    <td className="p-2 border">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2 border">{log.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
