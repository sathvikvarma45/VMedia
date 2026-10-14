// import { useEffect,useState } from "react";
// import {Link,useParams} from 'react-router-dom';
// import ReactPlayer from "react-player";
// import { Typography,Box,Stack } from "@mui/material";
// import { CheckCircle } from "@mui/icons-material";
// import {Videos} from './';
// import { fetchFromAPI } from "../utils/fetchFromAPI";
// const VideoDetail=()=>{
//   const [videoDetail, setVideoDetail] = useState(null);
//   const [videos, setVideos] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
//       .then((data) => setVideoDetail(data.items[0]));

//     fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
//       .then((data) => setVideos(data.items))
//   }, [id]);
//   if(!videoDetail?.snippet) return ("Loding...");
//   const{snippet:{title,channelId,channelTitle},statistics:{viewCount,likeCount}} =videoDetail;
//   return (
//     <Box minHeight="95vh">
//       <Stack direction={{ xs: "column", md: "row" }}>
//         <Box flex={1}>
//           <Box sx={{ width: "95%",position:'sticky', top: "20px" }}>
//             <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
//             <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
//               {title}
//             </Typography>
//             <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2} >
//               <Link to={`/channel/${channelId}`}>
//                 <Typography variant={{ sm: "subtitle1", md: 'h6' }}  color="#fff" >
//                   {channelTitle}
//                   <CheckCircle sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
//                 </Typography>
//               </Link>
//               <Stack direction="row" gap="20px" alignItems="center">
//                 <Typography variant="body1" sx={{ opacity: 0.7 }}>
//                   {parseInt(viewCount).toLocaleString()} views
//                 </Typography>
//                 <Typography variant="body1" sx={{ opacity: 0.7 }}>
//                   {parseInt(likeCount).toLocaleString()} likes
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Box>
//         </Box>
//         <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center" >
//           <Videos videos={videos} direction="column" />
//         </Box>
//       </Stack>
//       </Box>
//   )
// }

// export default VideoDetail;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";

import {
  Typography,
  Box,
  Stack,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

import { CheckCircle } from "@mui/icons-material";

import { Videos } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const { id } = useParams();

  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getVideoDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const videoResponse = await fetchFromAPI(
          `videos?part=snippet,statistics&id=${id}`
        );

        if (!videoResponse.items || videoResponse.items.length === 0) {
          throw new Error("Video details could not be found.");
        }

        const selectedVideo = videoResponse.items[0];

        const relatedResponse = await fetchFromAPI(
          `search?part=snippet&relatedToVideoId=${id}&type=video`
        );

        if (isMounted) {
          setVideoDetail(selectedVideo);
          setRelatedVideos(relatedResponse.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      getVideoDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatNumber = (number) => {
    if (number === undefined || number === null) {
      return "0";
    }

    return Number(number).toLocaleString();
  };

  const LoadingScreen = () => (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      gap={2}
    >
      <CircularProgress color="error" />

      <Typography color="white" variant="h6">
        Loading video details...
      </Typography>
    </Box>
  );

  const ErrorScreen = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      px={3}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#181818",
          color: "#fff",
          padding: 4,
          textAlign: "center",
          borderRadius: 3,
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Unable to Load Video
        </Typography>

        <Typography color="gray" sx={{ mb: 3 }}>
          {error}
        </Typography>

        <Link
          to="/"
          style={{
            color: "#ff0000",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Return to Home
        </Link>
      </Paper>
    </Box>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !videoDetail?.snippet) {
    return <ErrorScreen />;
  }

  const {
    snippet: {
      title = "Untitled Video",
      channelId,
      channelTitle = "Unknown Channel",
      description = "",
      publishedAt,
    },
    statistics = {},
  } = videoDetail;

  const {
    viewCount = 0,
    likeCount = 0,
  } = statistics;

  const videoUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <Box
      sx={{
        minHeight: "95vh",
        backgroundColor: "#0f0f0f",
        paddingBottom: 4,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          padding: { xs: 1, sm: 2 },
          alignItems: "flex-start",
        }}
      >
        <Box
          flex={1}
          width="100%"
          minWidth={0}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "transparent",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: { xs: "static", md: "sticky" },
                top: "20px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  backgroundColor: "#000",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="100%"
                  height="100%"
                  className="react-player"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </Box>

              <Box sx={{ px: { xs: 1, sm: 2 }, pt: 2 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#ffffff"
                  sx={{
                    fontSize: {
                      xs: "18px",
                      sm: "22px",
                      md: "24px",
                    },
                    lineHeight: 1.5,
                    mb: 2,
                  }}
                >
                  {title}
                </Typography>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Link
                    to={`/channel/${channelId}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          backgroundColor: "#272727",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          color="white"
                          fontWeight="bold"
                        >
                          {channelTitle.charAt(0).toUpperCase()}
                        </Typography>
                      </Box>

                      <Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <Typography
                            color="#fff"
                            fontWeight="bold"
                            variant="subtitle1"
                          >
                            {channelTitle}
                          </Typography>

                          <CheckCircle
                            sx={{
                              fontSize: 14,
                              color: "gray",
                            }}
                          />
                        </Stack>

                        <Typography
                          variant="caption"
                          color="gray"
                        >
                          Video creator
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography
                      variant="body2"
                      color="#aaaaaa"
                    >
                      {formatNumber(viewCount)} views
                    </Typography>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderColor: "#444",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="#aaaaaa"
                    >
                      {formatNumber(likeCount)} likes
                    </Typography>
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    borderColor: "#303030",
                    my: 2,
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    padding: 2,
                    backgroundColor: "#202020",
                    color: "#fff",
                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                    >
                      {formatNumber(viewCount)} views
                    </Typography>

                    {publishedAt && (
                      <Typography
                        variant="body2"
                        color="gray"
                      >
                        Published{" "}
                        {new Date(publishedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    variant="body2"
                    color="#dddddd"
                    sx={{
                      whiteSpace: "pre-line",
                      overflowWrap: "anywhere",
                      lineHeight: 1.7,
                    }}
                  >
                    {description || "No description available."}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box
          width={{ xs: "100%", md: "360px", lg: "400px" }}
          flexShrink={0}
          sx={{
            px: { xs: 1, sm: 2, md: 0 },
            pt: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h6"
            color="#ffffff"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Related Videos
          </Typography>

          <Divider
            sx={{
              borderColor: "#303030",
              mb: 2,
            }}
          />

          {relatedVideos.length > 0 ? (
            <Videos
              videos={relatedVideos}
              direction="column"
            />
          ) : (
            <Typography
              color="gray"
              variant="body2"
              sx={{ py: 2 }}
            >
              No related videos found.
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
