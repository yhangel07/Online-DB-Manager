-- Get Reg Path of each Instance available in the server
DECLARE 
	@GetInstances 
TABLE 
( 
	Id int IDENTITY(1,1),
	InstanceName      NVARCHAR(100),
	RegPath           NVARCHAR(100)
); 

INSERT INTO @GetInstances(InstanceName, RegPath)
EXEC   master..xp_instance_regenumvalues
       @rootkey = N'HKEY_LOCAL_MACHINE',
       @key     = N'SOFTWARE\\Microsoft\\Microsoft SQL Server\\Instance Names\\SQL'
       
SELECT * FROM @GetInstances

-- Get Port Number base on Reg Path

DECLARE
    @portNumber NVARCHAR(10)

EXEC xp_regread
    @rootkey    = 'HKEY_LOCAL_MACHINE',
    @key        = 'Software\Microsoft\Microsoft SQL Server\MSSQL10.MS2008_DEV1\MSSQLServer\SuperSocketNetLib\Tcp\IpAll',
    @value_name = 'TcpPort', 
    -- @value_name = 'TcpDynamicPorts',
    @value      = @portNumber OUTPUT

SELECT [Port Number] = @portNumber
GO

-- Mix query
DECLARE
    @portNumber NVARCHAR(10),
	@regPath NVARCHAR(40),
	@path NVARCHAR(max),
	@count binary(10);

SET @count = 1;

DECLARE 
	@GetInstances 
TABLE 
( 
	Id int IDENTITY(1,1),
	InstanceName      NVARCHAR(100),
	RegPath           NVARCHAR(100),
	port_number NVARCHAR(10)
); 

INSERT INTO @GetInstances(InstanceName, RegPath)
EXEC   master..xp_instance_regenumvalues
       @rootkey = N'HKEY_LOCAL_MACHINE',
       @key     = N'SOFTWARE\\Microsoft\\Microsoft SQL Server\\Instance Names\\SQL'
       
WHILE @count <= (SELECT count(*) FROM @GetInstances)
BEGIN
	SET @regPath = (SELECT RegPath from @GetInstances where Id = @count); --'MSSQL14.SQLEXPRESS';
	SET @path = 'Software\Microsoft\Microsoft SQL Server\';
	SET @path += @regPath;
	SET @path += '\MSSQLServer\SuperSocketNetLib\Tcp\IpAll';

	EXEC xp_regread
		@rootkey    = 'HKEY_LOCAL_MACHINE',
		@key        =  @path,
		@value_name = 'TcpPort', 
		--@value_name = 'TcpDynamicPorts',
		@value      = @portNumber OUTPUT

	IF @portNumber IS NULL
		EXEC xp_regread
			@rootkey    = 'HKEY_LOCAL_MACHINE',
			@key        =  @path,
			--@value_name = 'TcpPort', 
			@value_name = 'TcpDynamicPorts',
			@value      = @portNumber OUTPUT

	Update @GetInstances SET port_number = @portNumber where Id = @count;
		SET @count += 1;
END


Select * from @GetInstances
Go

