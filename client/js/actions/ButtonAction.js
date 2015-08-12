var AppDispatcher = require('../dispatcher/AppDispatcher');
var ConstActionType = require('../constants/ConstActionType');


var ButtonAction = {

  next: function() {
    AppDispatcher.handleViewAction({
      type: ConstActionType.BUTTON_NEXT
    });
  },

};

module.exports = ButtonAction;
