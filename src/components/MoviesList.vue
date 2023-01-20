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
          />
        </BCol>
      </template>
      <template v-else>
        <div>Emty list</div>
      </template>
    </BRow>
  </BContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MovieItem from './MovieItem.vue';

export default {
  name: 'MoviesList',
  components: {
    MovieItem,
  },
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
  },
  methods: {
    ...mapActions('movies', ['removeMovie']),
    ...mapActions(['showNotify']),

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
