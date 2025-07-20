import { useEffect, useState } from "react";
import { getVideoDetails } from "../api"; // adjust the path as needed

interface Props {
  videoId: string;
}

const VideoPlayer = ({ videoId }: Props) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getVideoDetails(videoId);
        setVideoData(data.items[0]);
      } catch (err) {
        setError("Failed to fetch video details");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  if (loading) return <p className="p-4">Loading video...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!videoData) return <p className="p-4">No video found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">{videoData.snippet.title}</h2>
      <iframe
        className="w-full h-64 rounded"
        src={`https://www.youtube.com/embed/${videoId}`}
        allowFullScreen
      ></iframe>
      <p className="text-gray-600">{videoData.snippet.description}</p>
    </div>
  );
};

export default VideoPlayer;
