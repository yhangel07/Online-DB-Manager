USE [SQLMonitor]
GO
/****** Object:  StoredProcedure [odbm].[sp_ClonePermsRights]    Script Date: 11/28/2018 06:48:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [odbm].[sp_ClonePermsRights] (
    @oldUser sysname, --ADID from which to copy permission right
    @newUser sysname, --ADID to which copy rights
    @printOnly bit = 1, --When 1 then only script is printed on screen, when 0 then also script is executed, when NULL, script is only executed and not printed
    @ISnew numeric(2) = 0, --When 0 new 1, edit, 2 delete 
    @ISSqlaunt bit = 0 --When 1 then SQL Auntthen, when 0 then alter windows login
)
AS
BEGIN

 
SET NOCOUNT ON

IF OBJECT_ID('tempdb..#output') IS NOT NULL
BEGIN
    TRUNCATE TABLE #output
    
    TRUNCATE TABLE #outputResult
END    
ELSE
BEGIN
    CREATE TABLE #output (
        command nvarchar(4000)
    )
        
        
        CREATE TABLE #outputResult (
        dname nvarchar(50),
        dnamerole nvarchar(50),
        dnameuser nvarchar(50)
    )
END    
    --DECLARE THE VARIABLES FOR HOLDING DATA.
    DECLARE
        @command nvarchar(4000),
        @sql nvarchar(max),
        @dbName nvarchar(128),
        @msg nvarchar(max),
        @logintype bit,
        @CheckDBName nvarchar(128)
        
      --DECLARE AND SET COUNTER.
      DECLARE @Counter INT
      SET @Counter = 1    
     
	  IF (SELECT CURSOR_STATUS('global','listOfDB')) >= -1
		 BEGIN
		  IF (SELECT CURSOR_STATUS('global','listOfDB')) > -1
		   BEGIN
			CLOSE listOfDB
		   END
		 DEALLOCATE listOfDB
	  END		
	  SET @sql = ''									
	  -- CREATE AND CHECK USER LOGIN
			IF CHARINDEX('AD\',@NewUser)> 0 and @ISSqlaunt = 1
			BEGIN
						SET @msg = 'New user ' + QUOTENAME(@NewUser) + ' Invalid name for SQL Authentication '

							RAISERROR(@msg, 11,1)
							RETURN			
			END

			IF CHARINDEX('AD\',@NewUser)= 0 and @ISSqlaunt = 0
			BEGIN
						SET @msg = 'New user ' + QUOTENAME(@NewUser) + ' Invalid name for Windows Authentication '

							RAISERROR(@msg, 11,1)
							RETURN			
			END

			IF NOT EXISTS(select 1 from  sys.server_principals  where name = @NewUser) 
				BEGIN 
						INSERT INTO #output(command)
						SELECT '--CREATE User login' AS command UNION ALL
						SELECT 'SET XACT_ABORT ON'	UNION ALL 
							SELECT 'CREATE LOGIN ' + QUOTENAME(@NewUser) +
									CASE WHEN @ISSqlaunt = 1 THEN
										  ' WITH PASSWORD = ''P@ssw0rd1234''  MUST_CHANGE,  CHECK_EXPIRATION = ON  
										 , DEFAULT_DATABASE = '+ QUOTENAME(sp.default_database_name) +
										', DEFAULT_LANGUAGE = '+ QUOTENAME(sp.default_language_name)	
									ELSE 
									 ' FROM WINDOWS ' + '
									 WITH DEFAULT_DATABASE = '+ QUOTENAME(sp.default_database_name)+
									', DEFAULT_LANGUAGE = '+ QUOTENAME(sp.default_language_name)			
								END AS command		
							FROM   sys.server_principals sp 
							INNER JOIN sys.database_principals dp ON dp.sid = sp.sid
							WHERE sp.name = @OldUser	  
				END
		
												
										
												
	  
	 -- BEGIN CURSOR CHECK LIST OF DATABASES IN A INSTANCSE
	 
	      DECLARE listOfDB CURSOR READ_ONLY
      FOR
		SELECT   name as DBName
			FROM sys.databases 
			WHERE collation_name = 'SQL_Latin1_General_CP1_CI_AS'
			ORDER BY database_id 
	 
	       --OPEN CURSOR.
      OPEN listOfDB
 
      --FETCH THE RECORD INTO THE VARIABLES.
      FETCH NEXT FROM listOfDB INTO
      @CheckDBName
 
      --LOOP UNTIL RECORDS ARE AVAILABLE.
      WHILE @@FETCH_STATUS = 0
      BEGIN
				
						

												SELECT
													@sql = N'', 
													--@dbName = QUOTENAME(DB_NAME())
													@dbName = @CheckDBName

												IF (NOT EXISTS(SELECT 1 FROM sys.database_principals where name = @oldUser))
												BEGIN
													SET @msg = 'Source user ' + QUOTENAME(@oldUser) + ' doesn''t exists in database ' + @dbName
													CLOSE listofDB
													DEALLOCATE listofDB
													RAISERROR(@msg, 11,1)
													RETURN
												END   

																		

												INSERT INTO #output(command)
												SELECT '--Database Context' AS command UNION ALL
												SELECT    'USE' + SPACE(1) + @dbName UNION ALL
												SELECT 'SET XACT_ABORT ON'
																								

												--IF @ISnew = 0
												--BEGIN       
													SET @sql = N'USE ' + @dbName + N';
													IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = @newUser)
													BEGIN
														INSERT INTO #output(command)
														SELECT ''--Create user'' AS command
																											
														INSERT INTO #output(command)
														SELECT 
															''CREATE USER '' + QUOTENAME(@NewUser) + '' FOR LOGIN '' + QUOTENAME(@NewUser) +
																CASE WHEN ISNULL(default_schema_name, '''') <> '''' THEN '' WITH DEFAULT_SCHEMA = '' + QUOTENAME(dp.default_schema_name)
																	ELSE ''''
																END AS Command
														FROM sys.database_principals dp
														INNER JOIN sys.server_principals sp ON dp.sid = sp.sid
														WHERE dp.name = @OldUser
													END'

													EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname', @OldUser = @OldUser, @NewUser = @NewUser
												--END

												INSERT INTO #output(command)
												SELECT    '--Cloning permissions from' + SPACE(1) + QUOTENAME(@OldUser) + SPACE(1) + 'to' + SPACE(1) + QUOTENAME(@NewUser)


												INSERT INTO #output(command)
												SELECT '--Role Memberships' AS command

												SET @sql = N'USE ' + @dbName + N';
												INSERT INTO #output(command)
												SELECT ''EXEC sp_addrolemember @rolename ='' 
													+ SPACE(1) + QUOTENAME(USER_NAME(rm.role_principal_id), '''''''') + '', @membername ='' + SPACE(1) + QUOTENAME(@NewUser, '''''''') AS command
												FROM    sys.database_role_members AS rm
												WHERE    USER_NAME(rm.member_principal_id) = @OldUser
												ORDER BY rm.role_principal_id ASC'

												EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname', @OldUser = @OldUser, @NewUser = @NewUser
												
												INSERT INTO #output(command)
												SELECT '--Role Memberships' AS command

												SET @sql = N'USE ' + @dbName + N';
												IF  EXISTS (SELECT 1 FROM sys.database_principals WHERE name = @OldUser)
												BEGIN
														INSERT INTO #outputResult
														select @dbName as dname,  QUOTENAME(USER_NAME(rm.role_principal_id)) , @NewUser as dnameuser
														FROM    sys.database_role_members AS rm
														WHERE    USER_NAME(rm.member_principal_id) = @OldUser
														ORDER BY rm.role_principal_id ASC
												END'

											EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname , @dbName sysname', @OldUser = @OldUser, @NewUser = @NewUser, @dbName = @dbName 
																								


												INSERT INTO #output(command)
												SELECT '--Object Level Permissions'

												SET @sql = N'USE ' + @dbName + N';
												INSERT INTO #output(command)
												SELECT    CASE WHEN perm.state <> ''W'' THEN perm.state_desc ELSE ''GRANT'' END
													+ SPACE(1) + perm.permission_name + SPACE(1) + ''ON '' + QUOTENAME(USER_NAME(obj.schema_id)) + ''.'' + QUOTENAME(obj.name) 
													+ CASE WHEN cl.column_id IS NULL THEN SPACE(0) ELSE ''('' + QUOTENAME(cl.name) + '')'' END
													+ SPACE(1) + ''TO'' + SPACE(1) + QUOTENAME(@NewUser) COLLATE database_default
													+ CASE WHEN perm.state <> ''W'' THEN SPACE(0) ELSE SPACE(1) + ''WITH GRANT OPTION'' END
												FROM    sys.database_permissions AS perm
													INNER JOIN
													sys.objects AS obj
													ON perm.major_id = obj.[object_id]
													INNER JOIN
													sys.database_principals AS usr
													ON perm.grantee_principal_id = usr.principal_id
													LEFT JOIN
													sys.columns AS cl
													ON cl.column_id = perm.minor_id AND cl.[object_id] = perm.major_id
												WHERE    usr.name = @OldUser
												ORDER BY perm.permission_name ASC, perm.state_desc ASC'

											EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname ', @OldUser = @OldUser, @NewUser = @NewUser


						

												SET @sql = N'USE ' + @dbName + N';
												IF  EXISTS (SELECT 1 FROM sys.database_principals WHERE name = @OldUser)
												BEGIN
												INSERT INTO #outputResult
												SELECT   @dbName as dname, CASE WHEN perm.state <> ''W'' THEN perm.state_desc ELSE ''GRANT'' END
													+ SPACE(1) + perm.permission_name + SPACE(1) +  ''ON'' + QUOTENAME(USER_NAME(obj.schema_id)) + ''.'' + QUOTENAME(obj.name) 
													+ CASE WHEN cl.column_id IS NULL THEN SPACE(0) ELSE ''('' + QUOTENAME(cl.name) + '')'' END
													+ SPACE(1)  COLLATE database_default
													+ CASE WHEN perm.state <> ''W'' THEN SPACE(0) ELSE SPACE(1) + ''WITH GRANT OPTION'' END, @NewUser as dnameuser
												FROM    sys.database_permissions AS perm
													INNER JOIN
													sys.objects AS obj
													ON perm.major_id = obj.[object_id]
													INNER JOIN
													sys.database_principals AS usr
													ON perm.grantee_principal_id = usr.principal_id
													LEFT JOIN
													sys.columns AS cl
													ON cl.column_id = perm.minor_id AND cl.[object_id] = perm.major_id
													WHERE    usr.name = @OldUser
												ORDER BY perm.permission_name ASC, perm.state_desc ASC
											
												END'

												EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname , @dbName sysname', @OldUser = @OldUser, @NewUser = @NewUser, @dbName = @dbName 


												INSERT INTO #output(command)
												SELECT N'--Database Level Permissions'

												SET @sql = N'USE ' + @dbName + N';
												INSERT INTO #output(command)
												SELECT    CASE WHEN perm.state <> ''W'' THEN perm.state_desc ELSE ''GRANT'' END
													+ SPACE(1) + perm.permission_name + SPACE(1)
													+ SPACE(1) + ''TO'' + SPACE(1) + QUOTENAME(@NewUser) COLLATE database_default
													+ CASE WHEN perm.state <> ''W'' THEN SPACE(0) ELSE SPACE(1) + ''WITH GRANT OPTION'' END
												FROM    sys.database_permissions AS perm
													INNER JOIN
													sys.database_principals AS usr
													ON perm.grantee_principal_id = usr.principal_id
												WHERE    usr.name = @OldUser
												AND    perm.major_id = 0
												ORDER BY perm.permission_name ASC, perm.state_desc ASC'

												EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname', @OldUser = @OldUser, @NewUser = @NewUser

												SET @sql = N'USE ' + @dbName + N';
												IF  EXISTS (SELECT 1 FROM sys.database_principals WHERE name = @OldUser)
												BEGIN
												INSERT INTO #outputResult
												SELECT   @dbName as dname,     CASE WHEN perm.state <> ''W'' THEN perm.state_desc ELSE ''GRANT'' END
													+ SPACE(1) + perm.permission_name + SPACE(1)
													+ SPACE(1) + ''TO'' + SPACE(1)  COLLATE database_default
													+ CASE WHEN perm.state <> ''W'' THEN SPACE(0) ELSE SPACE(1) + ''WITH GRANT OPTION'' END, @NewUser as dnameuser
												FROM    sys.database_permissions AS perm
													INNER JOIN
													sys.database_principals AS usr
													ON perm.grantee_principal_id = usr.principal_id
												WHERE    usr.name = @OldUser
												AND   perm.major_id = 0
												ORDER BY perm.permission_name ASC, perm.state_desc ASC
												END'
												EXEC sp_executesql @sql, N'@OldUser sysname, @NewUser sysname , @dbName sysname', @OldUser = @OldUser, @NewUser = @NewUser, @dbName = @dbName 
												



												DECLARE cr CURSOR FOR
													SELECT command FROM #output

												OPEN cr

												FETCH NEXT FROM cr INTO @command

												SET @sql = ''

												WHILE @@FETCH_STATUS = 0
												BEGIN
													IF (@printOnly IS NOT NULL)
													PRINT @command

													SET @sql = @sql + @command + CHAR(13) + CHAR(10)
													FETCH NEXT FROM cr INTO @command
												END

												CLOSE cr
												DEALLOCATE cr

												IF (@printOnly IS NULL OR @printOnly = 0)
													EXEC (@sql)

												TRUNCATE TABLE #output
												

												


            --INCREMENT COUNTER.
             SET @Counter = @Counter + 1
 
             --FETCH THE NEXT RECORD INTO THE VARIABLES.
             FETCH NEXT FROM listofDB INTO
              @CheckDBName
      END
 
      --CLOSE THE CURSOR.
      CLOSE listofDB
      DEALLOCATE listofDB            
	 
	 
	 SELECT * FROM #outputResult
	 
END
