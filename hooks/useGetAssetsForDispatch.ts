import PimmService from "../services/PimmService";

const useGetAssetsForDispatch = async (siteId: string) => {
  let object = await PimmService.getAssetsForDispatch(siteId);
  return object;
};

export default useGetAssetsForDispatch;
