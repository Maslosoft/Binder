// Generated by CoffeeScript 2.7.0
(function() {
  var test;

  test = function() {
    var doRound, elem, item1, item2, item3, item4, item5, sortable;
    sortable = new Maslosoft.Koe.SortableHtmlValues();
    sortable.title = 'Names Collection';
    item1 = new Maslosoft.Koe.HtmlValue();
    item1.text = 'Frank';
    sortable.items.push(item1);
    item2 = new Maslosoft.Koe.HtmlValue();
    item2.text = 'Sara';
    sortable.items.push(item2);
    item3 = new Maslosoft.Koe.HtmlValue();
    item3.text = 'John';
    sortable.items.push(item3);
    item4 = new Maslosoft.Koe.HtmlValue();
    item4.text = 'Anna';
    sortable.items.push(item4);
    item5 = new Maslosoft.Koe.HtmlValue();
    item5.text = 'Joseph';
    sortable.items.push(item5);
    binder.model.sortable = sortable;
    ko.track(binder.model);
    ko.applyBindings({
      model: binder.model
    }, document.getElementById('ko-binder'));
    doRound = function() {
      var index, json, model, res;
      json = JSON.stringify(binder.model);
      res = JSON.parse(json);
      for (index in res) {
        model = res[index];
        binder.model[index] = ko.tracker.factory(res[index]);
      }
      return console.log(binder.model);
    };
    elem = jQuery('#roundtripNestedNewTest');
    console.log("Starting test...");
    return describe('Test if will allow roundtrip of nested arrays, using new', function() {
      it('Should have same title after getting data from JSON', function() {
        assert.equal(binder.model.sortable.title, 'Names Collection');
        doRound();
        return assert.equal(binder.model.sortable.title, 'Names Collection');
      });
      it('Should allow pop', function() {
        assert.equal(binder.model.sortable.items.length, 5);
        assert.equal(elem.find('div').length, 5);
        binder.model.sortable.items.pop();
        assert.equal(binder.model.sortable.items[0].text, 'Frank', 'That first item is Frank');
        assert.equal(binder.model.sortable.items.length, 4, 'That one element was removed from array');
        assert.equal(elem.find('div').length, 4, 'That DOM elements are 4 too');
        doRound();
        assert.equal(binder.model.sortable.items[0].text, 'Frank', 'That first item is still Frank');
        assert.equal(binder.model.sortable.items.length, 4, 'That one element remains removed from array');
        return assert.equal(elem.find('div').length, 4, 'That DOM elements are 4 too');
      });
      return it('Should allow push', function() {
        var model;
        model = binder.model.sortable;
        assert.equal(model.items.length, 4);
        model.items.push(new Maslosoft.Koe.HtmlValue({
          text: 'new'
        }));
        assert.equal(model.items.length, 5, 'That one element was added');
        assert.equal(elem.find('div').length, 5, 'That DOM elements are 5 too');
        doRound();
        assert.equal(model.items[4].text, 'new', 'That last item is `new`');
        assert.equal(model.items.length, 5, 'That one element remains added');
        assert.equal(elem.find('div').length, 5, 'That DOM elements remains 5 too');
        return assert.equal(elem.find('div')[4].innerHTML, 'new', 'That DOM elements text is `new`');
      });
    });
  };

  setTimeout(test, 1000);

}).call(this);

//# sourceMappingURL=roundtripNestedNewTest.js.map
