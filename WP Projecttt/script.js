function handleSortChange() {
    const sortBySelect = document.getElementById('sortBy');
    const selectedSortBy = sortBySelect.value;

    // Call searchArticles with the selected sortBy
    searchArticles(1, selectedSortBy);
}


function searchArticles(page = 1, sortBy = 'relevancy') {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const searchInput = document.getElementById('search');
    const searchQuery = searchInput.value;

    const apiKey = '10f37abd81744204a2b3b6a222ca58e7';
    const apiUrl = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}&page=${page}&sortBy=${sortBy}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
          resultsDiv.textContent = 'An error occurred while fetching articles...';
        }
        return response.json();
      })
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          data.articles.forEach((article) => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'article';

            const articleTitle = document.createElement('a');
            articleTitle.href = article.url;
            articleTitle.textContent = article.title;

            const sourceName = document.createElement('p');
            sourceName.textContent = article.url;
            sourceName.className = 'source-name';

            const articleDescription = document.createElement('p');
            articleDescription.textContent = article.description;
            articleDescription.className = 'article-description';

            const publishedAt = document.createElement('p');
            const publishedDate = new Date(article.publishedAt);
            const currentDate = new Date();
            const timeDiff = Math.abs(currentDate.getTime() - publishedDate.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            publishedAt.textContent = `${diffDays} days ago`;
            publishedAt.className = 'published-at';

            

            articleDiv.appendChild(articleTitle);
            
            // Check if there's an image and add it
            if (article.urlToImage) {
                const articleImage = document.createElement('img');
                articleImage.className = 'article-image';
                articleImage.src = article.urlToImage;
                articleDiv.appendChild(articleImage);
              }
              articleDiv.appendChild(sourceName);
  
            articleDiv.appendChild(articleDescription);
            articleDiv.appendChild(publishedAt);

            resultsDiv.appendChild(articleDiv);
            
            
          });

          const totalPages = Math.ceil(data.totalResults / data.articles.length);
          addPaginationControls(page, totalPages, searchQuery, sortBy);
        } else {
          resultsDiv.textContent = 'No articles found.';
        }
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        resultsDiv.textContent = 'An error occurred while fetching articles...';
        resultsDiv.style.color = 'red';
        resultsDiv.style.fontWeight = 'bold';
        resultsDiv.style.align='center';
      });
  }

  function addPaginationControls(page, totalPages, searchQuery, sortBy) {
    const resultsDiv = document.getElementById('results');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    if (page > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous Page';
      prevButton.className = 'prev-page'; // Add class for styling
      prevButton.addEventListener('click', () => searchArticles(page - 1, sortBy));
      paginationDiv.appendChild(prevButton);
    }

    if (page < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next Page';
      nextButton.className = 'next-page'; // Add class for styling
      nextButton.addEventListener('click', () => searchArticles(page + 1, sortBy));
      paginationDiv.appendChild(nextButton);
    }

    resultsDiv.appendChild(paginationDiv);
}
