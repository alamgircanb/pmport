import {plCase,type PlCase} from './authoring';
import {PL_D as D} from './domains';

/** Case studies 16–20. All companies and data are invented. */
export const CASES4:PlCase[]=[
  plCase({id:'PLC16',title:'Cobalt Software',context:[
    'Overview. Cobalt Software sells subscriptions to business software. Finance wants reports on monthly recurring revenue (MRR), churn and customer growth.',
    'Existing environment. A Subscriptions table has one row per customer per month with the MRR amount. Customer data is in a CRM with a cloud API. The finance workspace uses Pro licenses.',
    'Requirements. MRR for a quarter must show the value of the last month in the quarter, not the sum of three months. Sales, finance and executive teams each need a different set of reports from one workspace. Analysts in the data team must build their own reports on the finance model without seeing draft reports in the workspace.',
    'Technical requirements. Keep a single certified finance semantic model.']},
  [
    [D.M,[6,'Why must MRR at quarter level use the last month of the quarter?',['MRR is a point-in-time value, so adding three months would triple count recurring revenue','MRR is recorded only in the last month of each quarter in the Subscriptions table','Quarter totals in Power BI ignore the month rows when Auto date/time is turned off','Quarter-level sums are not possible because the Date table has no quarter column'],0,'Recurring revenue is semi-additive over time and should be taken at the end of the period.','Semi-additive measures']],
    [D.M,['B',6,'Complete the MRR measure for any period.','MRR =\nCALCULATE(\n    SUM(Subscriptions[MRR]),\n    ____(\'Date\'[Date])\n)',[['Function',['LASTDATE','FIRSTDATE','DATESQTD','SAMEPERIODLASTYEAR'],0]],'LASTDATE limits the sum to the last date in context, which holds the month-end MRR rows.','Semi-additive measures']],
    [D.S,[2,'How should you give sales, finance and executives different sets of reports from one workspace?',['Publish one app with three audiences','Create three workspaces with copies of the model','Share each report one by one with everyone','Use RLS roles named Sales, Finance and Executive'],0,'App audiences show different items to different groups from one app.','App audiences']],
    [D.S,[6,'Which permission lets data team analysts build reports on the finance model without workspace access?',['Build permission on the semantic model','Viewer role in the workspace','Contributor role in the workspace','A data alert'],0,'Build permission allows creating content on the model without seeing the workspace items.','Build permission']],
    [D.S,[7,'Who can mark the finance semantic model as Certified?',['Users that the Fabric admin has authorized to certify content','Any workspace Viewer who uses the model','Any Member or Contributor of the workspace','The model\'s owner, as long as it is promoted first'],0,'Certification is limited to authorized reviewers set by the admin.','Endorsement']],
  ]),

  plCase({id:'PLC17',title:'Prairie Agri',context:[
    'Overview. Prairie Agri is a farming co-operative. Agronomists want to compare crop yields with weather.',
    'Existing environment. Yield data is in an on-premises PostgreSQL database. Weather data is downloaded from a public web API. Field boundaries are in a SharePoint list.',
    'Requirements. Combine yield and weather by field and date. Yield data must not be sent to the public weather service. A chart must show yield against rainfall for 500 fields and group similar fields. Agronomists want a forecast of next season\'s average yield.',
    'Technical requirements. Profile data before load.']},
  [
    [D.P,[2,'Which privacy level setting protects the yield data from being sent to the weather API when queries are combined?',['Set the yield source to Organizational or Private and the weather API to Public','Set both sources to Public so the queries can be combined and folded','Turn on Ignore privacy levels in the options of the current file','Set both sources to None and combine the queries in one step'],0,'Privacy levels stop Power Query from sending data from a more restricted source to a less restricted one.','Privacy levels']],
    [D.P,[1,'Which TWO items are needed to refresh the yield data in the service? (Choose two.)',['An on-premises data gateway in standard mode','The PostgreSQL driver on the gateway machine, if required by the connector','A Fabric capacity','A data alert'],[0,1],'On-premises databases need a gateway and any required drivers on it.','Gateways and connectors']],
    [D.V,[7,'Which feature groups similar fields in a scatter chart of yield against rainfall?',['Automatically find clusters','A Top N filter on yield per field','Group the fields with a constant line','Small multiples by field in the chart'],0,'Clustering creates groups of similar data points in a scatter chart.','Clustering']],
    [D.V,[8,'Which TWO conditions are needed to add a forecast to the yield chart? (Choose two.)',['A line chart with a continuous date axis','A single series without a legend','A scatter chart','A categorical text axis'],[0,1],'Forecast works on line charts with a continuous axis and one series.','Forecasting']],
    [D.P,[3,'Before loading yields, you need to find impossible values, such as negative yields. Which tool shows the minimum and maximum?',['Column profile','Column quality','Query dependencies','Data source settings'],0,'Column profile shows statistics such as min, max and average.','Column profile']],
  ]),

  plCase({id:'PLC18',title:'Tidewater Ports',context:[
    'Overview. Tidewater Ports handles container ships. Terminal supervisors need near-real-time views of container moves on tablets and phones.',
    'Existing environment. Container moves are written to an Azure SQL Database every few seconds. Vessel and berth data change daily.',
    'Requirements. The terminal page must refresh every minute. Supervisors use phones in portrait mode. Supervisors must be able to change a chart from moves by hour to moves by crane themselves. Exports of underlying data must be blocked.',
    'Technical requirements. Do not overload the database with queries.']},
  [
    [D.P,[2,'Which storage mode should the container moves table use?',['DirectQuery','Import with daily refresh','Import with 8 refreshes a day','Dual for the fact table only'],0,'DirectQuery shows current data for a near-real-time page.','Storage modes']],
    [D.V,[6,'Which TWO features meet the device and refresh requirements? (Choose two.)',['Automatic page refresh every minute on the terminal page','A mobile layout for the page','A paginated report','A dashboard subscription every minute'],[0,1],'Automatic page refresh re-queries DirectQuery data, and mobile layout supports phones in portrait.','Page refresh and mobile layout']],
    [D.V,[6,'How can supervisors change the chart\'s axis without edit rights?',['Turn on Personalize visuals for the report','Give supervisors the Contributor role','Create a bookmark per supervisor','Add a drillthrough page'],0,'Personalize visuals lets consumers change fields and visual types for themselves.','Personalize visuals']],
    [D.M,[8,'Which TWO actions reduce the number of queries the terminal page sends to the database? (Choose two.)',['Reduce the number of visuals on the page','Use Dual or Import for the small vessel and berth tables','Add more slicers that query the fact table','Turn on bi-directional filters for every relationship'],[0,1],'Fewer visuals means fewer queries, and cached dimensions avoid source queries for slicers.','DirectQuery performance']],
    [D.V,[6,'How should you block exports of underlying data for this report?',['Set the report\'s export option to allow summarised data only or none, within tenant settings','Turn off Personalize visuals so users cannot change the visuals','Hide the visual headers on the terminal page only','Apply RLS so supervisors only see their terminal when they export'],0,'Report settings control which export options are allowed.','Export settings']],
  ]),

  plCase({id:'PLC19',title:'Crescent Pharma',context:[
    'Overview. Crescent Pharma tracks clinical trial supply across 30 countries.',
    'Existing environment. Trial supply data is in a certified semantic model in the Supply workspace. Country managers build their own reports in a separate Country workspace. Some country managers are external contractors with accounts in their own companies.',
    'Requirements. Country managers see only their country. Contractors must access only the reports shared with them. All reports must inherit the Highly Confidential label. Before changing a measure in the certified model, the model owner must know which reports use it.',
    'Technical requirements. Keep one semantic model for all reports.']},
  [
    [D.S,[6,'Country managers build reports in the Country workspace on the certified model. What permission do they need on the model?',['Build','Write','Admin','Reshare only'],0,'Build permission allows creating reports on a shared model in another workspace.','Build permission']],
    [D.S,[5,'How should external contractors get access?',['Invite them as guest users and share only the specific reports with them','Add them as Members of the Supply workspace with their company accounts','Publish the reports to the web and send them the links privately','Email them exported PDFs of their country pages every day'],0,'B2B guest access with item sharing gives limited, secure access.','External access']],
    [D.S,[7,'Which TWO features meet the label and impact requirements? (Choose two.)',['Downstream inheritance of the sensitivity label from the model','Impact analysis on the semantic model before changes','Promote the model instead of certifying it','Turn off RLS for contractors'],[0,1],'Labels flow to new reports from the model, and impact analysis lists dependent items.','Labels and impact analysis']],
    [D.M,[4,'A CountryAccess table maps user emails to countries. Which role filter on CountryAccess implements the country rule?',['[Email] = USERPRINCIPALNAME()','[Country] = "All"','ISFILTERED([Email])','[Email] = SELECTEDVALUE([Email])'],0,'Dynamic RLS compares each row\'s email with the signed-in user.','Dynamic RLS']],
    [D.S,['Y',6,'You review security for Crescent Pharma. For each statement, select Yes if it is true. Otherwise, select No.',[['Reports in the Country workspace inherit the RLS of the certified model.',true],['Country managers who are Contributors in the Country workspace bypass RLS on the model in the Supply workspace.',false],['Guest users can be added to RLS roles.',true]],'RLS is enforced by the model. Edit rights in another workspace do not give write access to the model, so RLS still applies. Guests can be role members.','RLS across workspaces']],
  ]),

  plCase({id:'PLC20',title:'Redwood School District',context:[
    'Overview. Redwood School District has 45 schools. The district office wants attendance and assessment reports for principals and teachers.',
    'Existing environment. The student information system is on-premises SQL Server. Assessment scores come as CSV files from a vendor\'s SFTP site, which an IT script copies to a SharePoint Online folder each night.',
    'Requirements. Principals see their school only. Teachers access reports in Microsoft Teams. Attendance rate is days attended divided by days enrolled. The report must be accessible and work with keyboard navigation. Data refreshes nightly after 2 AM.',
    'Technical requirements. Combine all assessment files automatically. Use a common Date table.']},
  [
    [D.P,[7,'All nightly CSV files have the same columns. Which approach combines them automatically?',['SharePoint folder connector with Combine files','Append each file as a separate query by hand','Merge the files on StudentID','Transpose each file'],0,'Combine files appends all files with the same structure, including new ones.','Combine files']],
    [D.M,['B',5,'Complete the attendance rate measure.','Attendance Rate = ____(SUM(Attendance[DaysAttended]), SUM(Attendance[DaysEnrolled]))',[['Function',['DIVIDE','SUMX','CALCULATE','AVERAGE'],0]],'DIVIDE handles zero denominators safely.','DIVIDE']],
    [D.V,[6,'Which TWO actions support keyboard navigation and accessibility? (Choose two.)',['Set the tab order in the Selection pane','Add alt text and titles to visuals','Use only colour to show attendance levels','Hide all visual titles'],[0,1],'Tab order and alt text help keyboard and screen reader users.','Accessibility']],
    [D.S,[4,'Which source needs a gateway in Redwood\'s solution?',['The on-premises SQL Server student information system','The SharePoint Online folder of assessment files','Microsoft Teams','The Date table'],0,'On-premises SQL Server needs a gateway; the SharePoint folder is cloud-based.','When a gateway is required']],
    [D.S,[2,'How should teachers open the reports?',['Add the app or report as a tab in their Teams channels','Publish the report to the web and post the link in their Teams channels','Email the .pbix file to each teacher with a link to Teams','Export the report to PowerPoint nightly'],0,'Teams integration keeps sign-in and permissions.','Distribute in Teams']],
  ]),
];
