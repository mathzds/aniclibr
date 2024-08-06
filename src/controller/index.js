import fetch from "node-fetch";

const BASE_URL = "https://animeland.appanimeplus.tk/videoweb";

const Controller = {
  searchAnime: async ({ query }) => {
    const response = await fetch(BASE_URL + `/api.php?action=searchvideo&searchword=${query}`);
    return response.json();
  },

  getReleases: async () => {
    try {
      const response = await fetch(BASE_URL + "/api.php?action=latestvideos");
      let data = await response.text(); 

      if (data.endsWith('0')) {
        data = data.slice(0, -1); 
      }

      const jsonData = JSON.parse(data);

      return jsonData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getAnimeDetail: async ({ categoryId }) => {
    const response = await fetch(BASE_URL + `/api.php?action=viewcategory&categoryid=${categoryId}`);
    return response.json();
  },

  getAnimeEpisodes: async ({ categoryId }) => {
    const response = await fetch(BASE_URL + `/api.php?action=category_videos&category_id=${categoryId}`);
    return response.json();
  },
};

export default Controller;
