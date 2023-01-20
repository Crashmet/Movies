import axios from '@/plugins/axios';
import IDs from '@/store/mock/imdb_top_250';
import mutations from '../mutations';

function serializeResponse(movies) {
  // функция для прощения вида обьекта элементов базы фильмов
  return movies.reduce((acc, movie) => {
    acc[movie.imdbID] = movie;
    return acc;
  }, {});
}

const { MOVIES, CURRENT_PAGE, REMOVE_MOVIE, TOGGLE_SEARCH } = mutations;
// собираем названия мутейшен из сторы mutations

const moviesStore = {
  namespaced: true,
  state: {
    top250IDs: IDs,
    moviesPerPage: 12,
    currentPage: 1,
    movies: {},
    isSearch: false,
  },
  getters: {
    moviesList: ({ movies }) => movies,
    slicedIDs:
      ({ top250IDs }) =>
      (from, to) =>
        top250IDs.slice(from, to),
    currentPage: ({ currentPage }) => currentPage,
    moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
    moviesLength: ({ top250IDs }) => Object.keys(top250IDs).length,
    isSearch: ({ isSearch }) => isSearch,
  },
  mutations: {
    [MOVIES](state, value) {
      state.movies = value;
    },
    [CURRENT_PAGE](state, value) {
      state.currentPage = value;
    },
    [REMOVE_MOVIE](state, index) {
      state.top250IDs.splice(index, 1);
    },
    [TOGGLE_SEARCH](state, bool) {
      state.isSearch = bool;
    },
  },
  actions: {
    initMoviesStore: {
      handler({ dispatch }) {
        dispatch('fetchMovies');
      },
      root: true,
    },
    // обновляем список фильмов  вызовом метода dispatch

    async fetchMovies({ getters, commit, dispatch }) {
      try {
        dispatch('toggleLoader', true, { root: true });
        // из сторы лоадера диспатчим(вызываем) actions для вызова загрузки

        const { currentPage, moviesPerPage, slicedIDs } = getters;
        const from = currentPage * moviesPerPage - moviesPerPage;
        const to = currentPage * moviesPerPage;
        const moviesToFathc = slicedIDs(from, to);
        const requests = moviesToFathc.map((id) => axios.get(`/?i=${id}`));
        const response = await Promise.all(requests);
        const movies = serializeResponse(response);
        commit(MOVIES, movies);
      } catch (err) {
        console.log(err.message);
      } finally {
        // finally срабатываем в любом случае
        dispatch('toggleLoader', false, { root: true });
        // завершаем лоадер при окончании действия загрузки данных
      }
    },

    //пагинация
    changeCurrentPage({ commit, dispatch }, page) {
      commit(CURRENT_PAGE, page);
      dispatch('fetchMovies');
      // обновляем список фильмов  вызовом метода dispatch
    },

    // удаление фильма из списка
    removeMovie({ commit, dispatch, state }, id) {
      const index = state.top250IDs.findIndex((item) => item === id);

      if (index !== -1) {
        commit(REMOVE_MOVIE, index);
        dispatch('fetchMovies');
      }
    },

    // поиск фильма по данным из инпута
    async searchMovies({ commit, dispatch }, query) {
      try {
        dispatch('toggleLoader', true, { root: true });

        const response = await axios.get(`/?s=${query}`);

        if (response.Error) {
          throw Error(response.Error);
          // метод который прикращает работу функции и мы попадаем сразу в блок catch
          // удобнее чем return в данном случае
        }

        const movies = serializeResponse(response.Search);
        commit(MOVIES, movies);
      } catch (err) {
        dispatch(
          'showNotify',
          {
            msg: err.message,
            title: 'Error',
            variant: 'danger',
          },
          { root: true }
          // при ошибке записываем ее значение в стору для вывода уведомления
        );
      } finally {
        // finally срабатываем в любом случае
        dispatch('toggleLoader', false, { root: true });
        // завершаем лоадер при окончании действия загрузки данных
      }
    },

    toggleSearchState({ commit }, bool) {
      commit(TOGGLE_SEARCH, bool);
    },
  },
};

export default moviesStore;
