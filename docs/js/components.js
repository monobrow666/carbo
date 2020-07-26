// Components
Vue.component('app-nav-bar', {
  data: function () {
    return {
    }
  },
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">carbo</a>
      <form class="form-inline">
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

