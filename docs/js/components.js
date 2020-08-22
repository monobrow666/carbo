//
// Global Components
//
Vue.component('app-nav-bar', {
  data() {
    return {
      q: ''
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
// Local Components (for use in Pages)
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
  name: 'home-page',
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
  name: 'search-page',
  components: {
    'foods-list': FoodsList
  },
  data() {
    return {
    }
  },
  computed: {
    q() {
      return this.$route.query.q
    },
    foods() {
      return getFoods();
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
  name: 'foods-page',
  components: {
    'foods-list': FoodsList
  },
  data() {
    return {
    }
  },
  computed: {
    async foods() {
      return await getFoods();
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
  name: 'food-edit-page',
  data() {
    return {
      brand: '',
      name: '',
      servingSize: 0,
      servingSizeUnit: '',
      carbs: 0,
      notes: '',
      isProcessing: false,
    }
  },
  computed: {
    foodId() {
      return this.$route.params.id;
    },
    isUnitGrams() {
      return this.servingSizeUnit === 'grams';
    },
    isUnitOunces() {
      return this.servingSizeUnit === 'ounces';
    },
    isUnitCups() {
      return this.servingSizeUnit === 'cups';
    },
    isUnitTablespoons() {
      return this.servingSizeUnit === 'tablespoons';
    },
    isUnitTeaspoons() {
      return this.servingSizeUnit === 'teaspoons';
    },
    isUnitLiters() {
      return this.servingSizeUnit === 'liters';
    },
    isUnitPieces() {
      return this.servingSizeUnit === 'pieces';
    },
  },
  methods: {
    async processForm() {
      this.isProcessing = true;
      const newId = await saveFood({
        brand: this.brand,
        name: this.name,
        servingSize: this.servingSize,
        servingSizeUnit: this.servingSizeUnit,
        carbs: this.carbs,
        notes: this.notes,
      });
      this.isProcessing = false;
      this.$router.push('/food/' + newId);
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
        <h2 v-else class="light-grey">New Food</h2>
      </header>

      <form @submit.prevent="processForm">
        <div class="form-group">
          <label for="brand">Brand</label>
          <input class="form-control" id="brand" v-model="brand" placeholder="Brand">
        </div>

        <div class="form-group">
          <label for="name">Name</label>
          <input class="form-control" id="name" v-model="name" placeholder="Name" required>
        </div>

        <div class="form-group">
          <label for="serving_size">Serving Size</label>
          <input class="form-control" id="serving_size" v-model="servingSize" placeholder="Serving Size" required>
        </div>

        <div class="form-group">
          <label for="serving_size_unit">Serving Size Unit</label>
          <select class="form-control" id="serving_size_unit" v-model="servingSizeUnit" required>
            <option value="">Select...</option>
            <option value="grams" :selected="isUnitGrams">grams</option>
            <option value="ounces" :selected="isUnitOunces">ounces</option>
            <option value="cups" :selected="isUnitCups">cups</option>
            <option value="tablespoons" :selected="isUnitTablespoons">tablespoons</option>
            <option value="teaspoons" :selected="isUnitTeaspoons">teaspoons</option>
            <option value="liters" :selected="isUnitLiters">liters</option>
            <option value="pieces" :selected="isUnitPieces">pieces</option>
          </select>
        </div>

        <div class="form-group">
          <label for="carbs">Carbs</label>
          <div class="input-group">
            <input class="form-control" id="carbs" v-model="carbs" placeholder="Carbs" required>
            <div class="input-group-append">
              <span class="input-group-text">grams</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea class="form-control" id="notes" v-model="notes" placeholder="notes"></textarea>
        </div>

        <button class="btn btn-danger" type="submit" :disabled="isProcessing">Save</button>
      </form>
      <br>

    </div>
  `,
};

const FoodDetailPage = {
  name: 'food-detail-page',
  data() {
    return {
    }
  },
  computed: {
    food() {
      return getFoodById(this.$route.params.id);
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

      <div>
        <h3>
          {{food.name}}
          <router-link :to="'/food/' + food.id + '/edit'">
            <button class="btn btn-sm btn-outline-danger">Edit</button>
          </router-link>
        </h3>
        <h4>{{food.brand}}</h4>
      </div>

      <div class="list-group">
        <div class="list-group-item">
          <div class="input-group">
            <input id="servingSize" class="form-control" value="{{servingSize}}" placeholder="{{servingSize}}">
            <select id="servingSizeUnit">
              {{#if isUnitCups}}
                <option value="cups">* cups</option>
                <option value="tablespoons">tablespoons</option>
              {{/if}}
              {{#if isUnitTablespoons}}
                <option value="tablespoons">* tablespoons</option>
                <option value="teaspoons">teaspoons</option>
                <option value="cups">cups</option>
              {{/if}}
              {{#if isUnitTeaspoons}}
                <option value="teaspoons">* teaspoons</option>
                <option value="tablespoons">tablespoons</option>
              {{/if}}
              {{#if isUnitGrams}}
                <option value="grams">* grams</option>
                <option value="ounces">ounces</option>
              {{/if}}
              {{#if isUnitOunces}}
                <option value="ounces">* ounces</option>
                <option value="grams">grams</option>
              {{/if}}
              {{#if isUnitPieces}}
                <option value="pieces">* pieces</option>
              {{/if}}
            </select>
          </div>
        </div>
        <div class="list-group-item">
          <span id="carbs">{{carbs}}</span>
          <span>carbohydrates</span>
        </div>
        <div class="list-group-item">
          <div class="light-grey">notes</div>
          {{notes}}
        </div>
        <div class="list-group-item">
          <div class="light-grey">date updated</div>
          {{updatedAt}}
        </div>
        <div class="list-group-item">
          <div class="light-grey">date added</div>
          {{createdAt}}
        </div>
      </div>
    </div>
  `,
};

const NotFoundPage = {
  name: 'not-found-page',
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

