<template>
  <BContainer>
    <h3 class="list-title">IMDB top 250</h3>
    <BRow>
      <template v-if="isExist">
        <BCol cols="3" v-for="(movie, key) in list" :key="key">
          <MovieItem
            :movie="movie"
            @mouseover.native="onMouseOver(movie.Poster)"
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
    isExist() {
      return Boolean(Object.keys(this.list).length);
    },
  },
  methods: {
    onMouseOver(poster) {
      this.$emit('changePoster', poster);
      // передаем в родительскуий компонент постер, чтобы передать его в другой дочерний компонент
    },
  },
};
</script>

<style scoped>
.list-title {
  font-style: 50px;
  margin-bottom: 30px;
  color: #fff;
}
</style>
