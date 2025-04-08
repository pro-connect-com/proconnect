interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
}

interface Person {
  name: string;
  avatar: string;
  title: string;
  mutual: number;
}

class DashboardManager {
  private currentPage = 1;
  private isLoading = false;
  private posts: Post[] = [];
  private jobs: Job[] = [];
  private people: Person[] = [];

  constructor() {
    this.initEvents();
    this.loadInitialData();
  }

  private initEvents(): void {
    // Like button
    $(document).on('click', '.like-btn', (e) => this.handleLike(e));
    
    // Comment button
    $(document).on('click', '.comment-btn', () => {
      $('#commentModal').fadeIn();
    });
    
    // Share button
    $(document).on('click', '.share-btn', () => {
      $('#shareModal').fadeIn();
    });
    
    // Modal close buttons
    $(document).on('click', '.modal-close, .modal', function(e) {
      if ($(e.target).hasClass('modal') || $(e.target).hasClass('modal-close')) {
        $('.modal').fadeOut();
      }
    });
    
    // Infinite scroll
    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        this.loadMoreFeeds();
      }
    });
  }

  private async loadInitialData(): Promise<void> {
    try {
      // In production, replace with actual API endpoint
      // const response = await $.getJSON('/api/dashboard');
      
      // For development, use local JSON file
      const response = await $.getJSON('feeds/feeds.json');
      
      this.posts = response.posts;
      this.jobs = response.jobs;
      this.people = response.people;
      
      this.renderFeeds();
      this.renderJobs();
      this.renderPeople();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private async loadMoreFeeds(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    $('#loadingSpinner').show();
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would fetch more posts from the server
      // For demo, we'll just duplicate the existing posts
      const newPosts = [...this.posts];
      this.posts = [...this.posts, ...newPosts];
      
      this.renderFeeds(true);
    } catch (error) {
      console.error('Error loading more feeds:', error);
    } finally {
      this.isLoading = false;
      $('#loadingSpinner').hide();
    }
  }

  private renderFeeds(append: boolean = false): void {
    const feedContainer = $('#feedContainer');
    
    if (!append) {
      feedContainer.empty();
    }
    
    const postsToRender = append ? this.posts.slice(-5) : this.posts;
    
    postsToRender.forEach(post => {
      const postDate = new Date(post.timestamp);
      const formattedDate = postDate.toLocaleDateString('en-KE', {
        month: 'short',
        day: 'numeric'
      });
      
      const postHtml = `
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4" data-post-id="${post.id}">
          <div class="flex items-start mb-3">
            <img src="${post.author.avatar}" alt="${post.author.name}" 
                 class="w-10 h-10 rounded-full mr-3">
            <div>
              <h4 class="font-bold">${post.author.name}</h4>
              <p class="text-gray-500 text-sm">${post.author.title} • ${formattedDate}</p>
            </div>
          </div>
          <p class="mb-4">${post.content}</p>
          <div class="flex justify-between text-gray-500 text-sm mb-2">
            <span>${post.likes} likes</span>
            <span>${post.comments} comments • ${post.shares} shares</span>
          </div>
          <div class="border-t border-gray-100 pt-2 flex justify-between">
            <button class="like-btn flex items-center justify-center w-full py-1 ${post.isLiked ? 'text-brand-green' : 'text-gray-500 hover:text-brand-green'}">
              <svg class="w-5 h-5 mr-1" fill="${post.isLiked ? '#16a34a' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like
            </button>
            <button class="comment-btn flex items-center justify-center w-full py-1 text-gray-500 hover:text-brand-green">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comment
            </button>
            <button class="share-btn flex items-center justify-center w-full py-1 text-gray-500 hover:text-brand-green">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      `;
      
      if (append) {
        feedContainer.append(postHtml);
      } else {
        feedContainer.prepend(postHtml);
      }
    });
  }

  private renderJobs(): void {
    const jobsContainer = $('#jobRecommendations');
    jobsContainer.empty();
    
    this.jobs.forEach(job => {
      const jobHtml = `
        <div class="border-b border-gray-100 pb-3">
          <h5 class="font-semibold">${job.title}</h5>
          <p class="text-sm text-gray-600">${job.company} • ${job.location}</p>
          <p class="text-sm text-brand-green font-medium">${job.salary}</p>
          <p class="text-xs text-gray-500">${job.posted}</p>
        </div>
      `;
      jobsContainer.append(jobHtml);
    });
  }

  private renderPeople(): void {
    const peopleContainer = $('#peopleSuggestions');
    peopleContainer.empty();
    
    this.people.forEach(person => {
      const personHtml = `
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img src="${person.avatar}" alt="${person.name}" class="w-10 h-10 rounded-full mr-2">
            <div>
              <h5 class="font-semibold text-sm">${person.name}</h5>
              <p class="text-xs text-gray-600">${person.title}</p>
              <p class="text-xs text-gray-500">${person.mutual} mutual connections</p>
            </div>
          </div>
          <button class="text-brand-green text-sm font-semibold hover:underline">Connect</button>
        </div>
      `;
      peopleContainer.append(personHtml);
    });
  }

  private async handleLike(event: JQuery.Event): Promise<void> {
    const button = $(event.currentTarget);
    const postId = button.closest('[data-post-id]').data('post-id');
    const isLiked = button.hasClass('text-brand-green');
    
    try {
      // In production, this would be an API call
      // await $.post('/api/like', { postId, action: isLiked ? 'unlike' : 'like' });
      
      // For demo, we'll just update the UI
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const post = this.posts[postIndex];
        post.isLiked = !isLiked;
        post.likes = isLiked ? post.likes - 1 : post.likes + 1;
        
        button.toggleClass('text-brand-green');
        button.find('svg').attr('fill', post.isLiked ? '#16a34a' : 'none');
        
        const likesCount = button.closest('.flex').find('span:first');
        likesCount.text(`${post.likes} likes`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }
}

// Initialize when DOM is ready
$(document).ready(() => {
  new DashboardManager();
});