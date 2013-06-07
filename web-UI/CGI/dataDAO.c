#include <stdio.h>
#include "dataDAO.h" 

int connectDatabase(char* USER, char* PASS,char* db, char* server){
	connect=mysql_init(NULL);
	
	if(!connect){
		fprintf(stderr,"Inicialização no Mysql falhou.");
		return 1;
	}

	connect=mysql_real_connect(connect,server,USER,PASS,db,0,NULL,0);
	
	if(!connect){
		fprintf(stderr,"Impossível se conectar.");
		return 1;
	}
	
	return 0;
}

void saveData(Data* data){
	
}

int loadLastsDatas(Data* data,int q){
	MYSQL_RES *res_set;
	MYSQL_ROW row;

	char* queryWithOutQ = "select * from temperatures order by Date desc limit 0,%d;";
	char query[60];
	snprintf(query,60,queryWithOutQ,q-1);
	mysql_query(connect,query);
	
	res_set = mysql_store_result(connect);

	unsigned int numrows = mysql_num_rows(res_set);

	int i=0;
	while ((row = mysql_fetch_row(res_set)) != NULL){
		data[i].temperature = atoi((char*)row[2]);
		data[i].fromNode = (char*) row[0];
		data[i].time = (char*) row[1];
		i++;
    	}
	
	return numrows;
}

void closeConnection(){
	mysql_close(connect);
}