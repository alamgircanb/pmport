import type {GraphicSpec} from './exam-graphics-data';

/** Exhibits for the PL-300 (Power BI Data Analyst) simulator: model diagrams and small data tables. All data is invented. */
export const PL300_GRAPHICS:Record<string,GraphicSpec>={
  'pl-model-star':{kind:'model',label:'Sales model (model view)',tables:[
    {name:'Date',x:20,y:20,cols:['DateKey','Date','Month','Year']},
    {name:'Product',x:470,y:20,cols:['ProductKey','Product','Category']},
    {name:'Sales',x:245,y:130,cols:['DateKey','ProductKey','CustomerKey','StoreKey','Amount']},
    {name:'Customer',x:20,y:260,cols:['CustomerKey','Customer','Segment']},
    {name:'Store',x:470,y:260,cols:['StoreKey','Store','Region']}],
    rels:[{a:'Date',b:'Sales',card:'1:*',dir:'Single'},{a:'Product',b:'Sales',card:'1:*',dir:'Single'},{a:'Customer',b:'Sales',card:'1:*',dir:'Single'},{a:'Store',b:'Sales',card:'1:*',dir:'Single'}]},
  'pl-model-roleplay':{kind:'model',label:'Orders model with two date relationships',tables:[
    {name:'Date',x:20,y:60,cols:['Date','Month','Year']},
    {name:'Orders',x:400,y:40,cols:['OrderID','OrderDate','ShipDate','Amount']},
    {name:'Customer',x:400,y:220,cols:['CustomerID','Customer','Country']}],
    rels:[{a:'Date',b:'Orders',card:'1:*',dir:'Single'},{a:'Date',b:'Orders',card:'1:*',dir:'Single',active:false},{a:'Customer',b:'Orders',card:'1:*',dir:'Single'}]},
  'pl-model-snowflake':{kind:'model',label:'Product dimension stored as three tables',tables:[
    {name:'Category',x:20,y:20,cols:['CategoryID','Category']},
    {name:'Subcategory',x:20,y:150,cols:['SubcategoryID','CategoryID','Subcategory']},
    {name:'Product',x:245,y:150,cols:['ProductID','SubcategoryID','Product']},
    {name:'Sales',x:470,y:150,cols:['ProductID','DateKey','Quantity','Amount']}],
    rels:[{a:'Category',b:'Subcategory',card:'1:*',dir:'Single'},{a:'Subcategory',b:'Product',card:'1:*',dir:'Single'},{a:'Product',b:'Sales',card:'1:*',dir:'Single'}]},
  'pl-model-bidi':{kind:'model',label:'Model with a budget table and bi-directional filters',tables:[
    {name:'Date',x:20,y:20,cols:['Date','Month','Year']},
    {name:'Sales',x:245,y:20,cols:['Date','ProductID','RegionID','Amount']},
    {name:'Product',x:470,y:20,cols:['ProductID','Category']},
    {name:'Region',x:245,y:200,cols:['RegionID','Region']},
    {name:'Budget',x:470,y:200,cols:['RegionID','Category','BudgetAmount']}],
    rels:[{a:'Date',b:'Sales',card:'1:*',dir:'Single'},{a:'Product',b:'Sales',card:'1:*',dir:'Both'},{a:'Region',b:'Sales',card:'1:*',dir:'Both'},{a:'Region',b:'Budget',card:'1:*',dir:'Single'}]},
  'pl-model-m2m':{kind:'model',label:'Accounts shared by several customers',tables:[
    {name:'Customer',x:20,y:40,cols:['CustomerID','Customer']},
    {name:'CustomerAccount',x:245,y:40,cols:['CustomerID','AccountID']},
    {name:'Account',x:470,y:40,cols:['AccountID','AccountType']},
    {name:'Transactions',x:470,y:200,cols:['AccountID','Date','Amount']}],
    rels:[{a:'Customer',b:'CustomerAccount',card:'1:*',dir:'Single'},{a:'Account',b:'CustomerAccount',card:'1:*',dir:'Both'},{a:'Account',b:'Transactions',card:'1:*',dir:'Single'}]},
  'pl-model-rls':{kind:'model',label:'Model for regional sales managers',tables:[
    {name:'Manager',x:20,y:20,cols:['Email','RegionID']},
    {name:'Region',x:245,y:20,cols:['RegionID','Region']},
    {name:'Sales',x:470,y:20,cols:['RegionID','Date','Amount']},
    {name:'Date',x:470,y:190,cols:['Date','Month','Year']}],
    rels:[{a:'Region',b:'Manager',card:'1:*',dir:'Single'},{a:'Region',b:'Sales',card:'1:*',dir:'Single'},{a:'Date',b:'Sales',card:'1:*',dir:'Single'}]},
  'pl-model-hotspot':{kind:'model',label:'Inventory model',tables:[
    {name:'Calendar',x:20,y:20,cols:['Date','Month','Year']},
    {name:'Warehouse',x:470,y:20,cols:['WarehouseID','City']},
    {name:'Inventory',x:245,y:120,cols:['Date','WarehouseID','SKU','OnHandQty']},
    {name:'Item',x:20,y:250,cols:['SKU','Item','Brand']},
    {name:'Receipts',x:470,y:250,cols:['Date','WarehouseID','SKU','ReceivedQty']}],
    rels:[{a:'Calendar',b:'Inventory',card:'1:*',dir:'Single'},{a:'Warehouse',b:'Inventory',card:'1:*',dir:'Single'},{a:'Item',b:'Inventory',card:'1:*',dir:'Single'},{a:'Warehouse',b:'Receipts',card:'1:*',dir:'Single'}]},
  'pl-model-flat':{kind:'model',label:'Imported tables before modeling',tables:[
    {name:'SalesFlat',x:20,y:20,cols:['OrderDate','Customer','City','Product','Category','Qty','Amount']},
    {name:'Targets',x:245,y:20,cols:['Year','Month','Category','Target']},
    {name:'FX',x:470,y:20,cols:['Date','Currency','Rate']}],
    rels:[]},
  'pl-tbl-wide':{kind:'table',label:'Query "RegionalSales" in Power Query Editor',columns:['Region','Jan','Feb','Mar','Apr'],rows:[['North',1200,1350,1100,1420],['South',980,1010,1250,1190],['West',1500,1480,1610,1575]]},
  'pl-tbl-profile':{kind:'table',label:'Column quality for the "Orders" query (profiled on the entire data set)',columns:['Column','Valid','Error','Empty','Distinct','Unique'],rows:[['OrderID','100%','0%','0%','48,210','48,210'],['CustomerID','97%','0%','3%','6,012','812'],['OrderDate','99%','1%','0%','1,095','14'],['Discount','62%','0%','38%','11','0']]},
  'pl-tbl-inventory':{kind:'table',label:'Inventory snapshot rows (one row per item per day)',columns:['Date','Item','OnHandQty'],rows:[['2026-03-29','Valve',40],['2026-03-30','Valve',35],['2026-03-31','Valve',30],['2026-03-29','Pump',12],['2026-03-30','Pump',10],['2026-03-31','Pump',18]]},
  'pl-tbl-json':{kind:'table',label:'Result after connecting to a REST API that returns JSON',columns:['Name','Value'],rows:[['page','1'],['count','250'],['results','List']]},
  'pl-tbl-orders':{kind:'table',label:'Orders query preview',columns:['OrderID','OrderDate','Customer','Country','Amount'],rows:[[5001,'03/04/2026','Arbor Foods','Canada','1,250.00'],[5002,'15/04/2026','Kite Labs','Canada','310.50'],[5003,'21/04/2026','Arbor Foods','Canada','98.00'],[5004,'30/04/2026','Polar Bikes','Canada','Error']]},
  'pl-tbl-sales-visual':{kind:'table',label:'Matrix visual: Sales and Sales Last Year by month',columns:['Month','Sales','Sales LY'],rows:[['Jan',120,100],['Feb',90,110],['Mar',150,120],['Apr',130,'(blank)'],['Total',490,330]]},
  'pl-tbl-perf':{kind:'table',label:'Performance analyzer results for one report page (milliseconds)',columns:['Visual','DAX query','Visual display','Other','Total'],rows:[['Sales by month (line)',140,60,30,230],['Top customers (table)',4210,95,40,4345],['Margin % (card)',85,10,25,120],['Region slicer',30,12,15,57]]},
  'pl-tbl-refresh':{kind:'table',label:'Data sources for the "Operations" semantic model',columns:['Source','Location','Mode'],rows:[['SQL Server "OPS01"','On-premises data center','Import'],['Excel file "Targets.xlsx"','SharePoint Online','Import'],['Azure SQL Database "telemetry"','Azure','DirectQuery']]},
};
