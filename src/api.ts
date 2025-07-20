// services/auth.ts
import axios from "axios";

// Create an axios instance with baseURL and credentials included
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, 
});

export const verifyLogin = async () => {
   try {
    const response = await api.post("/verify-login");
    console.log("Login verified:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Verify login failed:", error.response?.data || error.message);
    throw error; // re-throw so caller can still handle it
  }
};

export const getVideoDetails = async (videoId: string) => {

  if(!videoId) {
    throw new Error("Video ID is required to fetch video details");
  }
    try {
     const response = await api.get(`/youtube/video/${videoId}`);
      console.log("Video details:", response.data);
  return response.data;
  } catch (error: any) {
    console.error("Verify login failed:", error.response?.data || error.message);
    throw error; // re-throw so caller can still handle it
  }
};

export const postComment = async (videoId: string, commentText: string) => {
  try {
    const response = await api.post(`/youtube/video/${videoId}/comment`, {
      text: commentText,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error posting comment:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVideoMetadata = async (
  videoId: string,
  payload: { title: string; description: string }
) => {
  if (!videoId || !payload.title || !payload.description) {
    throw new Error("Video ID, title, and description are required");
  }

  try {
    const response = await api.patch(`/youtube/video/${videoId}/metadata`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Update video metadata failed:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new personal note
// Add note for a specific video
export const addNote = async (videoId: string, content: string) => {
  try {
    const response = await api.post("/youtube/notes", { videoId, content });
    console.log("Note added:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Add note failed:", error.response?.data || error.message);
    throw error;
  }
};

// Get all personal notes for a specific video
export const getNotes = async (videoId: string) => {
  try {
    const response = await api.get(`/youtube/notes`, {
      params: { videoId },
    });
    console.log("Fetched notes:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Fetch notes failed:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await api.delete(`/youtube/comment/${commentId}`);
    console.log("Comment deleted:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Delete comment failed:", error.response?.data || error.message);
    throw error;
  }
};


export const getEventLogs = async () => {
  try {
    const response = await api.get("/youtube/video");
    console.log("Fetched event logs:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Fetch event logs failed:", error.response?.data || error.message);
    throw error;
  }
};