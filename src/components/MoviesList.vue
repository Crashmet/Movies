<template>
  <BContainer>
    <h1 class="list-title">{{ listTitle }}</h1>
    <BRow>
      <template v-if="isExist">
        <BCol cols="3" v-for="(movie, key) in list" :key="key">
          <MovieItem
            :movie="movie"
            @mouseover.native="onMouseOver(movie.Poster)"
            @removeItem="onRemoveItem"
            @showModal="onShowMovieInfo"
          />
        </BCol>
      </template>
      <template v-else>
        <div>Emty list</div>
      </template>
    </BRow>
    <BModal
      body-class="movie-modal-body"
      :id="movieInfoModalId"
      size="xl"
      hide-footer
      hide-header
    >
      <MovieInfoModalContent
        :movie="selectedMovie"
        @closeModal="onCloseModal"
      />
    </BModal>
  </BContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MovieItem from './MovieItem.vue';
import MovieInfoModalContent from './MovieInfoModalContent.vue';

export default {
  name: 'MoviesList',
  components: {
    MovieItem,
    MovieInfoModalContent,
  },
  data: () => ({
    movieInfoModalId: 'movie-info',
    selectedMovieId: '',
  }),
  props: {
    list: {
      tape: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters('movies', ['isSearch']),

    listTitle() {
      return this.isSearch ? 'Search result' : 'IMDB top 250 movies';
    },

    isExist() {
      return Boolean(Object.keys(this.list).length);
    },

    selectedMovie() {
      console.log(this.list);
      return this.selectedMovieId ? this.list[this.selectedMovieId] : null;
    },
  },
  methods: {
    ...mapActions('movies', ['removeMovie']),
    ...mapActions(['showNotify']),

    onCloseModal() {
      this.selectedMovieId = null;
      this.$bvModal.hide(this.movieInfoModalId);
    },

    onShowMovieInfo(id) {
      this.selectedMovieId = id;
      this.$bvModal.show(this.movieInfoModalId);
    },

    onMouseOver(poster) {
      this.$emit('changePoster', poster);
      // передаем в родительскуий компонент постер, чтобы передать его в другой дочерний компонент
    },

    async onRemoveItem({ id, title }) {
      const isConfirm = await this.$bvModal.msgBoxConfirm(
        `Are you sure delete "${title}"?`
      );
      // сonfirm из bootstrap

      if (isConfirm) {
        this.removeMovie(id);
        this.showNotify({
          msg: 'Movie deleted successful',
          title: 'Success',
          variant: 'success',
        });
      }
    },
  },
};
</script>

<style scoped>
.list-title {
  margin-bottom: 30px;
  color: #fff;
}
</style>

<style>
.movie-modal-body {
  padding: 0 !important;
}
</style>
