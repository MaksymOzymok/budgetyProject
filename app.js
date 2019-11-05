

//BUDGET CONTROLLER

var budgetyController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calculatePercentage = function(totalInc){
        if(totalInc>0){
        this.percentage = Math.round(this.value / totalInc * 100);
        }
        else{
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.allTotals[type] = sum;
    }

    var data = {
        allItems : {
            exp : [],
            inc : []
        },

        allTotals:{
            exp : 0,
            inc : 0
        },

        budget : 0,

        percentage : -1
    }

    return {
        addItem: function(type,des,val){
            var newItem,id;
            //create new id
            if(data.allItems[type].length > 0){
             ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0;
            }
             //create new item
            if(type==='inc'){
                newItem = new Income(ID,des,val);
            }
            if(type==='exp'){
                newItem = new Expense(ID,des,val);
            }
                //push our newItem to array[type]
            data.allItems[type].push(newItem);

            //return our element

            return newItem;
        },
        deleteItem : function(type,id){
            var ids,index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index!==-1){
                data.allItems[type].splice(index,1);
            }

        },
        calculateBudget : function(){

           //calculate income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate the budget

            data.budget = data.allTotals.inc - data.allTotals.exp;

            if(data.allTotals.inc>0){
            data.percentage = Math.round((data.allTotals.exp / data.allTotals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.allTotals.inc);
            });
        },
        getPercentages: function(){
            var AllPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return AllPerc;
        },
        getBudget:function(){
            return{
                budget : data.budget,
                totalInc : data.allTotals.inc,
                totalExp : data.allTotals.exp,
                percentage :data.percentage
            } 
        },

        testing : function() {
            console.log(data);
        }
    }
    

})();


//UI CONTROLLER

var UiController = (function(){

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer: '.expenses__list',
        budget : '.budget__value',
        budgetIncome : '.budget__income--value',
        budgetExpense : '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercItem: '.item__percentage'

    }

    return{
    getInput : function(){
        return{
        type : document.querySelector(DOMstrings.inputType).value,
        description : document.querySelector(DOMstrings.inputDescription).value,
        value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
        }

    },
    addListItem : function(obj,type){
        var html,newHtml,element;

        if(type==='exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
        }
      
      
        if(type==='inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }

        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml = newHtml.replace('%value%',obj.value);

        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)
    },
    deleteItem: function(id){
        var element = document.getElementById(id);

        element.parentNode.removeChild(element);
    },
    clearFields: function(){

        var fields,arrFields;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        arrFields = Array.prototype.slice.call(fields);

        arrFields.forEach(function(curent,index,array) {
            curent.value = "";
            
        });
        arrFields[0].focus();
        


    },
    displayBudget : function(obj){

        document.querySelector(DOMstrings.budget).textContent = obj.budget;
        document.querySelector(DOMstrings.budgetIncome).textContent = obj.totalInc;
        document.querySelector(DOMstrings.budgetExpense).textContent = obj.totalExp;
        document.querySelector(DOMstrings.budgetPercentage).textContent = obj.percentage;


    },
    displayPercentages : function(percentages){
        var elements  = document.querySelectorAll(DOMstrings.expensesPercItem);
        nodeListForEach = function(list, callback){
            for(var i = 0; i< list.length;i++){
                callback(list[i],i);
            }

        };



        nodeListForEach(elements,function(current,index){
            if(percentages[index]>0){
            current.textContent = percentages[index] + '%';
            }
            else{
                current.textContent = '---';
            }
        });
    },
     getDOMstrings : function(){
         return DOMstrings;
     }
    };
})();

//CONTROLLER

var controller = (function(budgetyCtrl,UiCtrl){

    var setupAddEventListeners = function(){

        var DOM = UiCtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

   document.addEventListener('keypress',function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget = function(){
         //calculate the budget
           budgetyCtrl.calculateBudget();

           //return the budget
           var budget = budgetyCtrl.getBudget();
   
           //display budget
           //console.log(budget);
           UiCtrl.displayBudget(budget);


    };
    var updatePercentages = function(){
        budgetyCtrl.calculatePercentages();

        var percentages = budgetyCtrl.getPercentages();
        UiCtrl.displayPercentages(percentages);
    }

    var ctrlDeleteItem = function(event){
        var itemId, splitId, type,ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        splitId = itemId.split('-');
        type = splitId[0];
        ID = parseInt(splitId[1]);

        budgetyCtrl.deleteItem(type,ID);
        UiCtrl.deleteItem(itemId);
        updateBudget();
       // console.log(ID)

    }

    var ctrlAddItem = function(){

               //1.get input data
            
        var input = UiCtrl.getInput();
        //console.log(input);

           // add new item to budget controller
            if(input.value>0 && !isNaN(input.value) && input.description!==""){
          var newItem =  budgetyCtrl.addItem(input.type,input.description,input.value);
            //add new item to UI contoller

            var newUiItem = UiCtrl.addListItem(newItem, input.type);

         //clear input fields

         UiCtrl.clearFields();
                //update our budget after click
         updateBudget();

         //Update percentages
         updatePercentages();
    };
        };
    return{
        init: function(){
            console.log('Application started');

            UiCtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupAddEventListeners();
        }
    }

})(budgetyController,UiController);

controller.init();