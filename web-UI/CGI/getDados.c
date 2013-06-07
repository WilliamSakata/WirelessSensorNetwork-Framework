#include <stdio.h>
#include "dataDAO.h"
#include <stdlib.h>
#define SERVER "localhost"
#define USER "root"
#define PASSWORD "123456"
#define DATABASE "monitorAbelhas"
 
int main()
{
    printf("Content-Type: text/html;charset=us-ascii\n\n");
 
    int connected = connectDatabase(USER,PASSWORD,DATABASE,SERVER);

    Data* data = malloc(sizeof(Data)*75);
    int numrows;
    if(connected == 0){
	numrows = loadLastsDatas(data,75);
    }

    int i;
    for(i=0; i < numrows; i++){
        printf("%s & %s & %d<br>\n",
		data[i].fromNode,data[i].time,data[i].temperature); 
    }
    
    closeConnection();  
    return 0;
}