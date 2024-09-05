let page = 1;
const limit = 10;

function loadArticles() {
    $.ajax({
        url: `/api/articles/paginated`,
        method: 'GET',
        data: {
            page: page,
            limit: limit
        },
        success: function(response) {
            // DOM에 게시글 추가
            const articles = response.data; // 응답 구조에 맞게 조정
            articles.forEach(article => {
                // 게시글을 목록에 추가
            });
            page++;
        },
        error: function(xhr, status, error) {
            console.error('게시글을 가져오는 중 오류 발생:', error);
        }
    });
}

// 초기 게시글 로드
loadArticles();

// 스크롤 시 더 많은 게시글 로드
$(window).on('scroll', () => {
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        loadArticles();
    }
});
