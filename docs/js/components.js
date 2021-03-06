//
// Global Components
//
Vue.component('app-nav-bar', {
  data() {
    return {
      q: '',
    }
  },
  methods: {
    search() {
      // TODO catch NavigationDuplicated errors
      this.$router.push({ path: "/search", query: { q: this.q } });
    },
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light box-shadow shadow-sm">
      <router-link class="navbar-brand text-info" to="/">carbo</router-link>
      <form class="form-inline" @submit.prevent="search">
        <div class="input-group">
          <input class="form-control" id="q" name="q" v-model="q" placeholder="food...">
          <div class="input-group-append">
            <button class="btn btn-info" type="submit">
              <i class="fa fa-search"></i>
            </button>
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
  methods: {
    shortDate(date) {
      return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    },
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
          {{food.brand}} <small class="float-right">{{shortDate(food.updatedAt)}}</small>
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
      <header class="mt-3">
        <router-link to="/food/new">
          <button class="btn btn-success box-shadow shadow-sm">
            <i class="fa fa-plus"></i>
            Add A Food
          </button>
        </router-link>
        <router-link to="/foods">
          <button class="btn btn-primary box-shadow shadow-sm">
            <i class="fa fa-clock-o"></i>
            Recently Updated
          </button>
        </router-link>
      </header>
      <article class="mt-3">
        <p>Carbo is an app for calculating carbohydrates per serving for meals and snacks.</p>
      </article>
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
      foods: [],
      isProcessing: true,
    }
  },
  computed: {
    q() {
      return this.$route.query.q;
    },
    areFoods() {
      return this.foods.length > 0;
    },
  },
  async created() {
    this.foods = await searchFoods(this.q);
    this.isProcessing = false;
  },
  watch: {
    async q() {
      this.isProcessing = true;
      this.foods = await searchFoods(this.q);
      this.isProcessing = false;
    },
  },
  template: `
    <div class="container-fluid">
      <header class="mt-3">
        <div v-if="isProcessing" class="text-center">
          <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <h3 v-else class="lead text-muted">Search results for '{{q}}'</h3>
      </header>
      <section v-if="!isProcessing">
        <foods-list v-if="areFoods" :foods="foods"></foods-list>
        <div v-else class="alert alert-warning">
          Oops! That search didn't find anything.
        </div>
      </section>
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
      foods: [],
      isProcessing: true
    }
  },
  async created() {
    this.foods = await getRecentFoods();
    this.isProcessing = false;
  },
  template: `
    <div class="container-fluid">
      <header class="mt-3">
        <div v-if="isProcessing" class="text-center">
          <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <h3 v-else class="text-muted">
          <i class="fa fa-clock-o"></i>
          Recently Updated Foods
        </h3>
      </header>
      <foods-list :foods="foods"></foods-list>
    </div>
  `,
};

const FoodEditPage = {
  name: 'food-edit-page',
  data() {
    return {
      id: '',
      brand: '',
      name: '',
      servingSize: 0,
      servingSizeUnit: '',
      carbs: 0,
      notes: '',
      isProcessing: true,
      saveError: '',
    }
  },
  computed: {
    foodId() {
      return this.$route.params.id;
    },
    foodDetailUrl() {
      if ( this.foodId ) {
        return '/food/' + this.foodId;
      }
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
      const food = {
        brand: this.brand,
        name: this.name,
        servingSize: this.servingSize,
        servingSizeUnit: this.servingSizeUnit,
        carbs: this.carbs,
        notes: this.notes,
      };
      if ( this.id ) {
        food.id = this.id;
      }

      let newId = '';
      try {
        newId = await saveFood( food );
      } catch (error) {
        console.log(error);
        this.saveError = error;
      }
      this.isProcessing = false;

      if ( newId ) {
        this.$router.push('/food/' + newId);
      }
    },
  },
  async created() {
    if ( !this.$route.params.id ) {
      // New food, so nothing to load
      this.isProcessing = false;
      return;
    }
    const food = await getFoodById(this.$route.params.id);
    this.isProcessing = false;
    // TODO handle errors
    this.id = food.id;
    this.brand = food.brand;
    this.name = food.name;
    this.servingSize = food.servingSize;
    this.servingSizeUnit = food.servingSizeUnit;
    this.carbs = food.carbs;
    this.notes = food.notes;
    this.updatedAt = food.updatedAt;
  },
  template: `
    <div class="container-fluid">
      <div v-if="isProcessing" class="text-center">
        <header class="mt-3">
          <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </header>
      </div>
      <div v-else>
        <header class="mt-3">
          <router-link v-if="foodId" :to="foodDetailUrl">
            <button class="btn btn-outline-primary box-shadow shadow-sm">
              <i class="fa fa-chevron-left"></i>
              Back to {{brand}} {{name}}
            </button>
          </router-link>
          <h3 v-else class="text-muted">New Food</h3>
        </header>

        <div v-if="saveError" class="mt-3 alert alert-danger">
          Oh, man. The save didn't work.
        </div>

        <form class="mt-3" @submit.prevent="processForm">
          <div class="form-group">
            <label for="brand">Brand</label>
            <input class="form-control" id="brand" v-model="brand" placeholder="a great brand...">
          </div>

          <div class="form-group">
            <label for="name">Name</label>
            <input class="form-control" id="name" v-model="name" placeholder="the food name..." required>
          </div>

          <div class="form-group">
            <label for="serving_size">Serving Size</label>
            <input type="number" step="0.01" min="0" class="form-control" id="serving_size" v-model="servingSize" required>
          </div>

          <div class="form-group">
            <label for="serving_size_unit">Serving Size Unit</label>
            <select class="form-control" id="serving_size_unit" v-model="servingSizeUnit" required>
              <option value="" disabled>select...</option>
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
            <label for="carbs">Carbohydrates</label>
            <div class="input-group">
              <input type="number" step="0.01" min="0" class="form-control" id="carbs" v-model="carbs" required>
              <div class="input-group-append">
                <span class="input-group-text">grams</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" v-model="notes" placeholder="this text is searchable..."></textarea>
          </div>

          <button class="btn btn-danger box-shadow shadow-sm" type="submit" :disabled="isProcessing">
            <span v-if="isProcessing" class="spinner-border spinner-border-sm"></span>
            <i v-else class="fa fa-floppy-o"></i>
            Save
          </button>
          <div v-if="saveError" class="alert alert-danger mt-3">
            {{saveError}}
          </div>
        </form>
        <br>

      </div>
    </div>
  `,
};

const FoodDetailPage = {
  name: 'food-detail-page',
  data() {
    return {
      id: '',
      brand: '',
      name: '',
      servingSize: 0,
      servingSizeUnit: '',
      carbs: 0,
      notes: '',
      updatedAt: 0,
      selectedUnit: '',
      enteredSize: 0,
      isProcessing: true
    }
  },
  computed: {
    baseFactor() {
      return this.carbs / this.servingSize;
    },
    calculatedCarbs() {
      if ( this.selectedUnit === this.servingSizeUnit ) {
        if ( this.enteredSize === this.servingSize ) {
          return this.carbs;
        } else {
          return this.twoDecimalPlaces(this.baseFactor * this.enteredSize);
        }
      }
      
      if ( this.isUnitCups ) {
        return this.twoDecimalPlaces(this.convertCups());
      }
      if ( this.isUnitTablespoons ) {
        return this.twoDecimalPlaces(this.convertTablespoons());
      }
      if ( this.isUnitTeaspoons ) {
        return this.twoDecimalPlaces(this.convertTeaspoons());
      }
      if ( this.isUnitGrams ) {
        return this.twoDecimalPlaces(this.convertGrams());
      }
      if ( this.isUnitOunces ) {
        return this.twoDecimalPlaces(this.convertOunces());
      }
      return 0; // TODO
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
    isUnitGrams() {
      return this.servingSizeUnit === 'grams';
    },
    isUnitOunces() {
      return this.servingSizeUnit === 'ounces';
    },
    isUnitPieces() {
      return this.servingSizeUnit === 'pieces';
    },
  },
  methods: {
    convertCups() {
      if ( this.selectedUnit === 'tablespoons' ) {
        return this.enteredSize * this.baseFactor * ( 1 / 16 );
      }
      if ( this.selectedUnit === 'teaspoons' ) {
        return this.enteredSize * this.baseFactor * ( 1 / 16 / 3 );
      }
    },
    convertTablespoons() {
      if ( this.selectedUnit === 'cups' ) {
        return this.enteredSize * this.baseFactor * ( 1 * 16 );
      }
      if ( this.selectedUnit === 'teaspoons' ) {
        return this.enteredSize * this.baseFactor * ( 1 / 3 );
      }
    },
    convertTeaspoons() {
      if ( this.selectedUnit === 'tablespoons' ) {
        return this.enteredSize * this.baseFactor * ( 1 * 3 );
      }
      if ( this.selectedUnit === 'cups' ) {
        return this.enteredSize * this.baseFactor * ( 1 * 3 * 16 );
      }
    },
    convertGrams() {
      if ( this.selectedUnit === 'ounces' ) {
        return this.enteredSize * this.baseFactor * ( 1 * 28.349 );
      }
    },
    convertOunces() {
      if ( this.selectedUnit === 'grams' ) {
        return this.enteredSize * this.baseFactor * ( 1 / 28.349 );
      }
    },
    twoDecimalPlaces(value) {
      return Number( Math.round(value + 'e2') + 'e-2');
    },
  },
  async created() {
    const food = await getFoodById(this.$route.params.id);
    this.isProcessing = false;
    // TODO handle errors
    this.id = food.id;
    this.brand = food.brand;
    this.name = food.name;
    this.servingSize = food.servingSize;
    this.servingSizeUnit = food.servingSizeUnit;
    this.carbs = food.carbs;
    this.notes = food.notes;
    this.updatedAt = food.updatedAt;

    // set initial input/selection
    this.enteredSize = food.servingSize;
    this.selectedUnit = food.servingSizeUnit;
  },
  template: `
    <div class="container-fluid">
      <div v-if="isProcessing" class="text-center">
        <header class="mt-3">
          <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </header>
      </div>
      <div v-else>
        <header class="mt-3">
          <router-link to="/foods">
            <button class="btn btn-primary box-shadow shadow-sm">
              <i class="fa fa-chevron-left"></i>
              Recently Updated
            </button>
          </router-link>
          <router-link :to="'/food/' + id + '/edit'">
            <button class="btn btn-outline-danger box-shadow shadow-sm">
              <i class="fa fa-pencil"></i>
              Edit
            </button>
          </router-link>
        </header>

        <div class="mt-3">
          <h3>{{name}}</h3>
          <h4 class="font-weight-lighter text-muted">{{brand}}</h4>
        </div>

        <div class="list-group">
          <div class="list-group-item">
            <div class="input-group">
              <input id="servingSize" class="form-control" v-model="enteredSize" :placeholder="servingSize">
              <select id="servingSizeUnit" class="custom-select" v-model="selectedUnit">
                <option disabled value="">select...</option>
                <option v-if="isUnitCups" selected value="cups">* cups</option>
                <option v-if="isUnitCups" value="tablespoons">tablespoons</option>
                <option v-if="isUnitTablespoons" selected value="tablespoons">* tablespoons</option>
                <option v-if="isUnitTablespoons" value="teaspoons">teaspoons</option>
                <option v-if="isUnitTablespoons" value="cups">cups</option>
                <option v-if="isUnitTeaspoons" selected value="teaspoons">* teaspoons</option>
                <option v-if="isUnitTeaspoons" value="tablespoons">tablespoons</option>
                <option v-if="isUnitGrams" selected value="grams">* grams</option>
                <option v-if="isUnitGrams" value="ounces">ounces</option>
                <option v-if="isUnitOunces" selected value="ounces">* ounces</option>
                <option v-if="isUnitOunces" value="grams">grams</option>
                <option v-if="isUnitPieces" selected value="pieces">* pieces</option>
              </select>
            </div>
          </div>
          <div class="list-group-item">
            <span id="carbs">{{calculatedCarbs}}</span>
            <span>Carbohydrates</span>
          </div>
          <div class="list-group-item">
            <div class="small text-muted">Notes</div>
            {{notes}}
          </div>
          <div class="list-group-item">
            <div class="small text-muted">Date Updated</div>
            {{updatedAt}}
          </div>
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

