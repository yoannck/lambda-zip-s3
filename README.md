
# lambda-zip-s3

AWS Lambda function to zip ressources of S3 buckets.
Optional : Keep the order of the input and rename them.

## How to use

### Prerequisites

In your AWS console, create your function Lambda with your permissions

### Properties

**Required**

region **[string]** : Region name where your files are located
bucket **[string]** : Bucket name where your files are located
folder **[string]** : Folder name where your files are located, if root just the value ''
folder **[array]** : Array of keys (string) of each file you need to include into your zip file
zipFileName **[string]** : Output Zip name

**optional**

keepOrderAndRename **[object]**
keepOrderAndRename.rename **[string]** : Rename all your files with an increment number. ex: `[020] RENAME`
keepOrderAndRename.pad **[number]** : The pad number order

source **[string]**: Bucket name where your files are located
destination **[string]**: Bucket name where you want to upload your zipped file

### Deploy lambda
zip the folder and upload it in your lambda panel.

Note:
If you are doing huge zip please increase/decrease default values of your used memory function Lambda depending on your needs.
