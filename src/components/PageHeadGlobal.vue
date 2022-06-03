<template>
  <div id="pagehead">
    <v-card flat tile color="background">
      <v-layout row wrap class="pt-3 mb-3">
        <v-flex xs12 sm6 md8 class="pl-4">
          <bread-crubs></bread-crubs>
        </v-flex>
        <v-flex xs12 sm6 md4 class="text-md-center text-xs-center"> </v-flex>
      </v-layout>
      <div class="pl-2 border-bottom" v-if="menu.length > 0">
        <v-tabs v-model="tab" slot="extension" color="transparent" slider-color="grey darken-3">
          <v-tab v-for="(item, index) in menu" :key="'menu-' + index" :to="{ name: item.route }">
            <v-icon v-if="item.icon" class="pr-1" small>
              {{ item.icon }}
            </v-icon>
            {{ item.texto }}
            <span class="counter" v-if="item.badge">
              {{ item.badge }}
            </span>
          </v-tab>
        </v-tabs>
      </div>
      <div class="pb-3" v-else></div>
    </v-card>
  </div>
</template>

<script>
import BreadCrubs from './BreadCrumbs.vue';

export default {
  name: 'PageHeadGlobal',
  components: {
    BreadCrubs,
  },
  props: {
    menu: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.counter {
  background-color: rgba(27, 31, 35, 0.08);
  border-radius: 20px;
  color: #444d56;
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  padding: 2px 5px;
  margin-left: 5px;
}
</style>
