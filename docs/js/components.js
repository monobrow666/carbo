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
      <router-link class="navbar-brand" to="/">Carbo</router-link>
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
      <header>
        <router-link to="/food/new">
          <button class="btn btn-outline-success">+ Add a food</button>
        </router-link>
        <router-link to="/foods">
          <button class="btn btn-outline-primary">Recently Updated</button>
        </router-link>
      </header>
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
      foods: new FoodCollection().search()
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
      foods: new FoodCollection().search()
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
      food: {
      },
      loading: false,
    }
  },
  computed: {
    foodId() {
      return this.$route.params.id;
    },
  },
  methods: {
    save() {
      this.loading = true;
    },
  },
  template: `
    <div class="container-fluid">
      <header>
        <router-link v-if="foodId" to="'/food/' + foodId">
          <button class="btn btn-outline-primary">
            &lt; back to {{brand}} {{name}}
          </button>
        </router-link>
        <span v-else class="light-grey">New Food</span>
      </header>

      <form @submit.prevent="save">
        <div class="form-group">
          <label for="brand">brand</label>
          <input class="form-control" id="brand" name="brand" value="{{brand}}" placeholder="brand">
        </div>

        <div class="form-group">
          <label for="name">name</label>
          <input class="form-control" id="name" name="name" value="{{name}}" placeholder="name" required>
        </div>

        <div class="form-group">
          <label for="serving_size">serving size</label>
          <input class="form-control" id="serving_size" name="serving_size" value="{{servingSize}}" placeholder="serving size" required>
        </div>

        <div class="form-group">
          <label for="serving_size_unit">serving size unit</label>
          <select class="form-control" id="serving_size_unit" name="serving_size_unit" required>
            <option value="">select...</option>
            <option value="grams" {{#if isUnitGrams}} selected {{/if}}>grams</option>
            <option value="ounces" {{#if isUnitOunces}} selected {{/if}}>ounces</option>
            <option value="cups" {{#if isUnitCups}} selected {{/if}}>cups</option>
            <option value="tablespoons" {{#if isUnitTablespoons}} selected {{/if}}>tablespoons</option>
            <option value="teaspoons" {{#if isUnitTeaspoons}} selected {{/if}}>teaspoons</option>
            <option value="liters" {{#if isUnitLiters}} selected {{/if}}>liters</option>
            <option value="pieces" {{#if isUnitPieces}} selected {{/if}}>pieces</option>
          </select>
        </div>

        <div class="form-group">
          <label for="carbs">carbs</label>
          <div class="input-group">
            <input class="form-control" id="carbs" name="carbs" value="{{carbs}}" placeholder="carbs" required>
            <div class="input-group-append">
              <span class="input-group-text">grams</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="notes">notes</label>
          <textarea class="form-control" id="notes" name="notes" placeholder="notes">{{notes}}</textarea>
        </div>

        <button class="btn btn-danger" type="submit">Save</button>
      </form>
    </div>
  `,
};

const FoodDetailPage = {
  name: "food-detail-page",
  data() {
    return {
    }
  },
  computed: {
    food() {
      console.log('id:', this.$route.params.id);
      console.log('food:', new Food(this.$route.params.id));
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

