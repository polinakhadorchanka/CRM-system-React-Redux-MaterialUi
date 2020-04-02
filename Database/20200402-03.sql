ALTER function [dbo].[IsExist](@Url nvarchar(500), @Position nvarchar(200), @CompanyId uniqueidentifier)
returns bit

begin
	declare @Result bit
	if (@Url is null or @Position is null or @CompanyId is null)
		set @Result = 1
	else
	begin
		if exists(select * from Vacancy where Url = @Url) or
			exists(select * from Vacancy where Position = @Position and CompanyId = @CompanyId)
			set @Result = 1
		else set @Result = 0
	end
	return @Result
end