# Bottom Sheet
Bottom sheet, implemented in pure HTML, CSS, and JavaScript

## Features
- There is a draggable area to resize the sheet
- The sheet can be closed using a button in the top right corner or using the `Esc` key
- Supporting Multiple sheet create

```javascript
    let data = '<h2>Hello</h2>';
    //Create Object
    let BottomSheet = new Mata_BottomSheet(data,'home');
    
    //Create Element 
    BottomSheet.create();

    //Remove Element 
     BottomSheet.remove();
    
    //Command
     BottomSheet.open();
     BottomSheet.close();
     BottomSheet.toggle();
```

