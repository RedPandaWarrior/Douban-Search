const MENU_MOVIE = "douban_movie_search";
const MENU_BOOK  = "douban_book_search";

chrome.runtime.onInstalled.addListener(() => {
  // 只在“选中文本”时显示
  chrome.contextMenus.create({
    id: MENU_MOVIE,
    title: "🎬 电影《%s》",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: MENU_BOOK,
    title: "📚 图书《%s》",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const name = (info.selectionText || "").trim();
  if (!name) return;

  const encoded = encodeURIComponent(name);

  let url = null;
  if (info.menuItemId === MENU_MOVIE) {
    url = `https://search.douban.com/movie/subject_search?search_text=${encoded}&cat=1002`;
  } else if (info.menuItemId === MENU_BOOK) {
    url = `https://search.douban.com/book/subject_search?search_text=${encoded}&cat=1001`;
  }

  if (url) chrome.tabs.create({ url });

});
