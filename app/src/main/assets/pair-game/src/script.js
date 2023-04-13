window.lobby = {};

///////////////////////////////////////////////////////////

/**
 *  BoardItem
 *  Create a board item to play with
 **/
(function(window)
{
  /**
   *  A board item
   **/
  function BoardItem()
  {
    this.view = '';
    this.init();
  }
  
  var p = BoardItem.prototype;
  
  /**
   *  Init the board item
   **/
  p.init = function()
  {
    this.container = jQuery('#board');
    this.view = jQuery(this.getDom()).appendTo(this.container);
  };
  
  /** 
   *  Define the current color
   *
   *  @param value String
   **/
  p.setColor = function (value)
  {
    if (this.color == value)
      return;
    
    this.color = value;
    this.view.addClass( 'board__item\-\-'+this.color.className );
  }
  
  /**
   *  Toggle the board item
   **/
  p.toggle = function()
  {
    if (this.active)
      this.deactivate();
    else
      this.activate();
  };
  
  /**
   *  Activate the board item
   **/
  p.activate = function()
  {
    if (this.active)
      return;
      
    this.active = true;
    this.view.addClass('board__item--active');
  };
  
  /**
   *  Deactivate the board item
   **/
  p.deactivate = function()
  {
    if (!this.active)
      return;
    
    this.active = false;
    this.view.removeClass('board__item--active');
  };
  
  /**
   *  Disable the item
   **/
  p.disable = function()
  {
    this.view.removeClass('board__item--active');
    this.view.addClass('board__item--disabled');
  }
  
  /**
   *  Create the dom for the class
   **/
  p.getDom = function()
  {
    return '<div class="board__item"></div>';
  };
  
  
  window.lobby.BoardItem = BoardItem;
})(window);

///////////////////////////////////////////////////////////

(function(window)
{
  
  function Color( className, key )
  {
    this.className = className; 
    this.key = key;
  }
  
  Color.blue = new Color('blue');
  Color.green = new Color('green');
  Color.pink = new Color('pink');
  Color.purple = new Color('purple');
  Color.red = new Color('red');
  Color.yellow = new Color('yellow');
  
  Color.all = [Color.blue, Color.green, Color.pink, Color.purple, Color.red, Color.yellow ];
  
  /**
   *  Return a random color
   *
   *  @return Color
   **/
  Color.random = function()
  {
    return Color.all[ Math.random()*Color.all.length |0 ];
  }
  
  window.lobby.Color = Color;
})(window);


///////////////////////////////////////////////////////////

/**
 *  Level
 *  Contains the level definitions
 **/
(function(window)
{
  function Level( className, cols, rows )
  {
    this.className = className;
    this.cols = cols;
    this.rows = rows;
  }
  
  Level.first = new Level('board--two', 2, 2);
  Level.second = new Level('board--three', 3, 2);
  Level.third = new Level('board--four', 4, 4);
  Level.fourth = new Level('board--six', 6, 6);
  Level.five = new Level('board--seven', 7, 8);
  
  Level.all = [Level.first, Level.second, Level.third, Level.fourth, Level.five];
  Level.getClasses = function()
  {
    var ret = '';
    Level.all.forEach( function(e, i)
    {
      ret += e.className + ' ';   
    });
      
    return ret;
  }
  
  /**
   *  Return a level based on it's index
   *
   *  @param index int
   *  @return Level
   **/
  Level.getByIndex = function (index)
  {
    return Level.all[index];
  }
  
  window.lobby.Level = Level;
})(window);

///////////////////////////////////////////////////////////

/**
 *  Board
 *  Manage the board
 **/
(function()
{
  /** 
   *  Board
   **/
  function Board()
  {
    this.view = jQuery("#board");
    this.init();
  }
  
  /**
   *  Prototype
   **/
  var p = Board.prototype;
  
  /**
   *  Init the board
   **/
  p.init = function()
  {
    this.levels = window.lobby.Level.all;
    this.view.on('click', onBoardClick.bind(this));
    
    this.setCurrentLevel( this.levels[0] );
  };
  
  /**
   *  Toggle an element
   *
   *  @param item BoardItem
   **/
  p.toggle = function( item )
  {
    var index = this.children.indexOf( item );
    item.toggle();
    
    this.activated.push( item );
  
    if ( this.activated.length >= 2 )
    {
      var c = this.activated[0].color;
      var valid = this.activated.every( function(e, i){ return e.color == c; } );
      if ( valid ) this.activated.forEach( function(e, i){ e.disable(); this.disabled.push(e) }, this );
      else this.activated.forEach( function(e, i){ e.deactivate() }, this );
      this.activated = [];
      if ( this.disabled.length >= this.children.length ) this.nextLevel();
    }
  }
  
  /**
   *  Define the current level
   *
   *  @parm value Number
   **/
  p.setCurrentLevel = function( value )
  {
    if (value == this.level)
      return;
    
    this.level = value;
    var qty = this.level.cols * this.level.rows;
    
    // reset & empty the container
    this.view.removeClass( window.lobby.Level.getClasses() );
    this.view.empty();
    this.children = [];
    this.disabled = [];
    this.activated = [];
    
    // set the view with the proper level
    this.view.addClass( this.level.className );
    
    // determine the pairs
    this.matrix = this.getNewMatrix( this.level );
    this.matrix.forEach( function(e, i)
    {
      var child = new lobby.BoardItem();
      child.setColor( e );
      this.children.push( child );
    }.bind(this));
  };
  
  /**
   *  Display the next level  
   **/
  p.nextLevel = function()
  {
    var i = this.levels.indexOf( this.level );
    var n = i + 1 < this.levels.length ? i+1 : 0;
    var l = this.levels[n];
    
    this.setCurrentLevel(l);
  }
  
  /**
   *  Generate a new color matrix for the given level
   *
   *  @param level Level
   *  @return Array
   **/
  p.getNewMatrix = function( level )
  {
    var ret = [];
    var cols = level.cols;
    var rows = level.rows;
    var qty = (cols*rows);
    var i = 0;
    
    while (i++ < (qty>>1))
    {
      color = lobby.Color.random();
      ret.push( color, color ); 
    }
    
    return shuffleArray(ret);
  }
  
  /**
   *  Find the baord item associated with a dom element
   *
   *  @param el 
   *  @return BoardItem
   **/
  p.getBoardItemByDomElement = function( el )
  {
    var ret = null;
    
    this.children.forEach(function(e, i)
    {
      if ( e.view[0] == el[0] )
      {
        ret = e;
      }  
    });
    
    return ret;
  }
  
  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }
  
  
  /**
   *  Click on the board
   *
   *  @param event MouseEvent
   **/
  function onBoardClick(event)
  {
    var el = jQuery(event.target);
    if (!el.hasClass('board__item'))
      return;
    
    this.toggle( this.getBoardItemByDomElement(el) );
  }
  
  window.lobby.Board = Board;
})(window);

var board = new lobby.Board();
jQuery('#debug a').on('click', function(event)
{
  var t = jQuery(event.currentTarget);
  var i = t.attr('data-level');
  board.setCurrentLevel( lobby.Level.getByIndex(i) );
});
