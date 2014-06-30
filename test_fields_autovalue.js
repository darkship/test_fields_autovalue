Containers=new Meteor.Collection("Containers",{schema:{
  name:{
     type:String
  },
  item_ids:{
     type:Array(String),
     optional: true,
     defaultValue: []
  }
}})

Items= new Meteor.Collection("Items",{schema:{
done:{
  type:Boolean,
  optional:true,
  defaultValue:false
},
container_id:{
  type:String
},
lastPosition:{
      type:Number,
      label:"last position of the item",
      optional:true,
      autoValue:function(){
          var done=this.field("done")

          if(this.isUpdate && done.operator=="$set" && done.value)
          {
              var _id=this.field("_id").value
              var container_id=this.field("container_id").value
              console.log(_id,container_id)
              return _.indexOf(Containers.findOne(container_id,{field:{item_ids:1}},{reactive:false}).item_ids,_id)
          }
          else
          {
              this.unset()
          }

      }
    }
  }
})
if (Meteor.isClient) {



  Containers.insert({name:"new container"},function(err,id){
    if(err)
    {
      console.error(err,"error")
      return
    }

    Items.insert({container_id:id},function(err,item_id){
      if(err)
      {
        console.error(err)
        return
      }
      Containers.update(id,{$addToSet:{item_ids:item_id}},function(err){
        if(err)
        {
          console.error(err)
          return
        }
        Items.update(item_id,{$set:{done:true}},function(err){
          console.error(err)
          return
        })

      })
    })



  })































































  Template.hello.greeting = function () {
    return "Welcome to test_fields_autovalue.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
