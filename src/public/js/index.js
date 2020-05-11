function search() {
    return {
        term: '',
        isOpen: false,
        movies: [],
        dirty: false,
        doSearch() {
            if (!this.term) {
                this.dirty = false
                this.movies = []
                return;
            };
            fetch(`/search?term=${this.term}`).then(res => res.json()).then(movies => {
                this.movies = movies.map(movie => {
                    let media = ''
                    switch (movie.media_type) {
                        case 'movie':
                            media = 'movies'
                            break;
                        case 'tv':
                            media = 'tv'
                            break;
                        case 'actor':
                        default:
                            media = 'actors'
                    }
                    const image =
                        (movie.poster_path || movie.profile_path) ? `https://image.tmdb.org/t/p/w92${movie.poster_path || movie.profile_path}` : 'https://dummyimage.com/500x750/cbd5e0/1a202c.png&text=Image+Not+Found'

                    return {
                        ...movie,
                        image,
                        link: `/${media}/${movie.id}`
                    }
                }).slice(0, 5)
                this.dirty = true;
            })
        },
        slashFocus(event) {
            if (event.keyCode === 191) {
                event.preventDefault();
                this.$refs.search.focus();
            }
        },
        handleClear(event) {
            event.preventDefault();
            if (event.target.value === "") {
                this.term = '';
                this.isOpen = false;
                this.movies = [];
                this.dirty = false;
            }
        }
    }
}