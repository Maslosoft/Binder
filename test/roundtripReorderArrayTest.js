// Generated by CoffeeScript 2.7.0
(function() {
  var test;

  test = function() {
    var before, doRound, elem, getNames, sortable;
    getNames = function(model) {
      var i, index, item, len, names, ref;
      names = [];
      if (!model.items) {
        console.log(model);
        throw new Error("Empty items");
      }
      ref = model.items;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        item = ref[index];
        names.push(item.text);
      }
      return names;
    };
    sortable = null;
    before = function() {
      var item1, item2, item3, item4, item5;
      sortable = new Maslosoft.Koe.SortableHtmlValues();
      sortable.title = 'Names Collection';
      item1 = new Maslosoft.Koe.HtmlValue();
      item1.text = 'Anna';
      sortable.items.push(item1);
      item2 = new Maslosoft.Koe.HtmlValue();
      item2.text = 'Frank';
      sortable.items.push(item2);
      item3 = new Maslosoft.Koe.HtmlValue();
      item3.text = 'John';
      sortable.items.push(item3);
      item4 = new Maslosoft.Koe.HtmlValue();
      item4.text = 'Joseph';
      sortable.items.push(item4);
      item5 = new Maslosoft.Koe.HtmlValue();
      item5.text = 'Sara';
      sortable.items.push(item5);
      return binder.model.sortable = sortable;
    };
    before();
    ko.track(binder.model);
    ko.applyBindings({
      model: binder.model
    }, document.getElementById('ko-binder'));
    doRound = function(andDo) {
      var index, json, model, res;
      json = JSON.stringify(binder.model);
      res = JSON.parse(json);
      console.log(getNames(res.sortable));
      // Do something
      if (andDo) {
        andDo(res);
      }
      for (index in res) {
        model = res[index];
        ko.tracker.fromJs(binder.model[index], res[index]);
      }
      return console.log(getNames(binder.model.sortable));
    };
    elem = jQuery('#roundtripReorderArrayTest');
    console.log("Starting test...");
    console.log(elem.find('div'));
    return describe('Test if will allow server side reordering of arrays with ko.fromJs on JS side', function() {
      it('Should have same title after getting data from JSON', function() {
        before();
        assert.equal(binder.model.sortable.title, 'Names Collection');
        assert.equal(elem.find('div').length, 5, 'There are 5 div elements');
        doRound();
        assert.equal(binder.model.sortable.title, 'Names Collection');
        return assert.equal(elem.find('div').length, 5, 'There are 5 div elements');
      });
      it('Should allow reordering', function() {
        var reorder;
        before();
        assert.equal(binder.model.sortable.items.length, 5);
        assert.equal(elem.find('div').length, 5, 'There are 5 div elements');
        assert.equal(binder.model.sortable.items[0].text, 'Anna', 'That first item is Anna');
        reorder = function(res) {
          var el;
          // Remove frank and push it to the end
          el = res.sortable.items.splice(1, 1);
          return res.sortable.items.push(el[0]);
        };
        doRound(reorder);
        assert.equal(binder.model.sortable.items.length, 5, 'That there are same amount of items');
        assert.equal(elem.find('div').length, 5, 'That DOM elements have same amount');
        assert.equal(binder.model.sortable.items[0].text, 'Anna', 'That 0 item is Anna');
        assert.equal(binder.model.sortable.items[1].text, 'John', 'That 1 item is John');
        assert.equal(binder.model.sortable.items[2].text, 'Joseph', 'That 2 item is Joseph');
        assert.equal(binder.model.sortable.items[3].text, 'Sara', 'That 3 item is Sara');
        return assert.equal(binder.model.sortable.items[4].text, 'Frank', 'That 4 item is Frank');
      });
      return it('Should allow removing', function() {
        var remove;
        before();
        assert.equal(binder.model.sortable.items.length, 5);
        assert.equal(elem.find('div').length, 5, 'There are 5 div elements');
        assert.equal(binder.model.sortable.items[0].text, 'Anna', 'That first item is Anna');
        remove = function(res) {
          var el;
          // Remove John
          return el = res.sortable.items.splice(2, 1);
        };
        doRound(remove);
        assert.equal(binder.model.sortable.items.length, 4, 'That there are same amount of items');
        assert.equal(elem.find('div').length, 4, 'That DOM elements have same amount');
        assert.equal(binder.model.sortable.items[0].text, 'Anna', 'That 0 item is Anna');
        assert.equal(binder.model.sortable.items[1].text, 'Frank', 'That 1 item is Frank');
        assert.equal(binder.model.sortable.items[2].text, 'Joseph', 'That 2 item is Joseph');
        return assert.equal(binder.model.sortable.items[3].text, 'Sara', 'That 3 item is Sara');
      });
    });
  };

  setTimeout(test, 1000);

}).call(this);

//# sourceMappingURL=roundtripReorderArrayTest.js.map
