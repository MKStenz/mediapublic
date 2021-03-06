import _ from 'underscore';
import storage from 'shared/organizations/storage';
import {organizations} from 'shared/search/datasets';

import Text from './text';

export default Text.extend({
  dataset: _.extend({}, organizations, {limit: 5}),

  storage,

  render() {
    Text.prototype.render.apply(this);

    _.defer(() => {
      this.$el.typeahead({}, this.dataset);
      this.$el.on('typeahead:select', (event, suggestion) => {
        this.value = suggestion.id;
        this.preview = this.$el.val();
      });
      this.$el.on('typeahead:change', () => {
        if (this.$el.val() !== this.preview) {
          this.value = '';
          this.$el.val('');
        }
      });
      this.$el.on('change', () => {
        if (this.$el.val() === '') {
          this.value = '';
        }
      });
    });

    return this;
  },

  getValue() {
    console.log('getting ', this.value);
    return this.value;
  },

  setValue(value) {
    this.value = value;
    console.log('setting ', value);
    if (this.value) {
      this.storage.find(this.value).then((model) => {
        this.$el.val(model.get('short_name'));
        this.preview = model.get('short_name');
      });
    }
  }
});
