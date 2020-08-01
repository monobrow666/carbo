//
// Components
//

Vue.component('app-nav-bar', {
  data: function () {
    return {
    }
  },
  methods: {
    search() {
      this.$router.push("search")
    },
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">carbo</a>
      <form class="form-inline" method="get" action="search">
        <div class="input-group">
          <input id="search" class="form-control" name="q" placeholder="Food...">
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit">Search</button>
          </div>
        </div>
      </form>
    </nav>
  `,
});

//
// Pages
//
const HomePage = {
  name: 'home-page',
  props: ['message'],
  data: function () {
    return {
    }
  },
  template: `
    <div>
      <p>home</p>
      <p>{{message}}</p>
    </div>
  `,
};

const SearchPage = {
  name: 'search-page',
  data: function () {
    return {
    }
  },
  template: `
    <p>search</p>
  `,
};

