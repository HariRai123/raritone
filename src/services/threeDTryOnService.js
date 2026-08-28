import API from "./api";

export const createThreeDTryOnSession = async ({
  productId,
  threeDAssetId,
}) => {
  const response = await API.post("/3d-tryon/session", {
    productId,
    threeDAssetId,
  });

  return response.data;
};

export const getThreeDTryOnSession = async (id) => {
  const response = await API.get(`/3d-tryon/session/${id}`);

  return response.data;
};

export const updateThreeDBodyData = async ({
  sessionId,
  avatarData,
  poseData,
  bodyData,
}) => {
  const response = await API.patch(
    `/3d-tryon/session/${sessionId}/body`,
    {
      avatarData,
      poseData,
      bodyData,
    },
  );

  return response.data;
};