//
// Global Components
//
Vue.component("app-nav-bar", {
  data() {
    return {
      q: ""
    }
  },
  methods: {
    search() {
      this.$router.push({ path: "/search", query: { q: this.q } })
    }
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="navbar-brand" to="/">carbo</router-link>
      <form class="form-inline" @submit.prevent="search">
        <div class="input-group">
          <input class="form-control" id="q" name="q" v-model="q" placeholder="Food...">
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit">Search</button>
          </div>
        </div>
      </form>
    </nav>
  `,
});

//
// Local Components
//
const FoodsList = {
  name: 'foods-list',
  props: ['foods'],
  data() {
    return {
    }
  },
  template: `
    <div class="list-group">
      <router-link v-for="food in foods"
        class="list-group-item list-group-item-action"
        :to="'/food/' + food.id"
        :key="food.id"
      >
        <div class="item">
          <h5>{{food.name}}</h5>
          {{food.brand}} <small class="float-right">{{food.updatedAt}}</small>
        </div>
      </router-link>
    </div>
  `,
};

//
// Pages
//
const HomePage = {
  name: "home-page",
  data() {
    return {
    }
  },
  template: `
    <div class="container-fluid">
      <p>home</p>
    </div>
  `,
};

const SearchPage = {
  name: "search-page",
  components: {
    "foods-list": FoodsList
  },
  data() {
    return {
      foods: [
        { id: "1", name: "apple", brand: "", updatedAt: new Date() },
        { id: "2", name: "orange", brand: "", updatedAt: new Date() }
      ]
    }
  },
  computed: {
    q() {
      return this.$route.query.q
    }
  },
  template: `
    <div class="container-fluid">
      <header>
        <span class="light-grey">Search results for '{{q}}'</span>
      </header>
      <foods-list v-if="foods" :foods="foods"></foods-list>
      <div v-else class="alert alert-warning">Oops! Nothing found</div>
    </div>
  `,
};

const FoodsPage = {
  name: "foods-page",
  components: {
    "foods-list": FoodsList
  },
  data() {
    return {
      foods: [
        { id: "1", name: "apple", brand: "", updatedAt: new Date() },
        { id: "2", name: "orange", brand: "", updatedAt: new Date() }
      ]
    }
  },
  template: `
    <div class="container-fluid">
      <header>
        <span class="light-grey">Recently updated Foods</span>
      </header>
      <foods-list :foods="foods"></foods-list>
    </div>
  `,
};

const FoodEditPage = {
  name: "food-edit-page",
  data() {
    return {
    }
  },
  computed: {
    foodId() {
      return this.$route.params.id
    }
  },
  template: `
    <div class="container-fluid">
      <p>id: {{foodId}}</p>
    </div>
  `,
};

const FoodDetailPage = {
  name: "food-detail-page",
  data() {
    return {
      food: {
        id: 1,
        name: 'apple',
        brand: '',
      }
    }
  },
  template: `
    <div class="container-fluid">
      <header>
        <router-link to="/foods">
          <button class="btn btn-outline-primary">
            &lt; Back to recently updated Foods
          </button>
        </router-link>
      </header>

      <div id="app">
        <h3>
          {{food.name}}
          <router-link :to="'/food/' + food.id + '/edit'">
            <button class="btn btn-sm btn-outline-danger">Edit</button>
          </router-link>
        </h3>
        <h4>{{food.brand}}</h4>
      </div>
    </div>
  `,
};

const NotFoundPage = {
  name: "not-found-page",
  data() {
    return {
    }
  },
  template: `
    <div class="container-fluid">
      <h1>Oh Noes!</h1>
      <p>I couldn't find the page you're looking for.</p>
    </div>
  `,
};

