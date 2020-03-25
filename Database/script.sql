create function [dbo].[getParserState](@token nvarchar(30), @apiKey nvarchar(30))
returns int
as
	begin
	declare @ret int = 0
	set @ret = (select ParserState from Parsers where ParserKey = @apiKey and ParserToken = @token)
	return @ret
end
GO


create function [dbo].[IsExist](@Url nvarchar(500), @Position nvarchar(200), @CompanyId uniqueidentifier)
returns bit
begin
	declare @Result bit

	if exists(select * from Vacancy where Url = @Url) or
		exists(select * from Vacancy where Position = @Position and CompanyId = @CompanyId)
		set @Result = 1
	else set @Result = 0

	return @Result
end
GO

CREATE function [dbo].[LogInValidation](@login nvarchar(20), @pass nvarchar(25))
returns @ret table (ClientId uniqueidentifier null, Login nvarchar(20) null, Password nvarchar(25) null, Email nvarchar(50) null, errorCode int)
as 
	begin
	if((select count(*) from Client where login = @login) = 0 or (select count(*) from Client where password = @pass) = 0 or 
	 ((select count(*) from Client where login = @login) = 0 and (select count(*) from Client where password = @pass) = 0))	
	 begin
		insert into @ret values(null,null,null,null,3)
	end
	else 
	begin
		declare @idC uniqueidentifier = (select Id from Client where login = @login),
			@em nvarchar(50) = (select email from Client where login = @login)
		insert into @ret values(@idC,@login,@pass,@em,0)
	end
	return
end
GO

CREATE function [dbo].[testF0](@idC uniqueidentifier, @filter nvarchar(30), @techFIlter nvarchar(max))
returns @ret table (VacancyId uniqueidentifier, Url nvarchar(500), Position nvarchar(200), Location nvarchar(100), Description nvarchar(max),
		 SiteAddingDate nvarchar(10), CompanyName nvarchar(100), Website nvarchar(300), Country nvarchar(50),Type nvarchar(100), DbAddingDate datetime, IsViewed bit,
		  IsRemoved bit, BoardStatus nvarchar(15), Comment nvarchar(300), Technologies nvarchar(max)) as
	begin
	declare @vacId uniqueidentifier, @url nvarchar(500), @position nvarchar(500), @location nvarchar(100), @description nvarchar(max), 
	 @siteAddingDate nvarchar(10), @companyName nvarchar(100), @website nvarchar(300), @country nvarchar(50), @type nvarchar(100), @DbAddingDate datetime,
	  @isViewed bit, @isRemoved bit, @boardStatus nvarchar(15), @counter int = 0, @comment nvarchar(300), @technologies nvarchar(max)
	if(@filter = 'all')
	begin
		if(@techFilter = 'undefined')
		begin
			declare cursM0 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM0
			fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin		
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
					continue
				end
				else
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
					set @counter += 1
					if(@counter = 10)
					begin
						break
					end
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
				end
			end	
			close cursM0
			deallocate cursM0	
		end
		else
		begin
			declare cursM0 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId where Technologies LIKE '%'+@techFilter+'%' order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM0
			fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin		
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
					continue
				end
				else
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
					set @counter += 1
					if(@counter = 10)
					begin
						break
					end
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
				end
			end				
			close cursM0
			deallocate cursM0	
		end
	end
	else if(@filter = 'unviewed')
	begin
		if(@techFilter = 'undefined')
		begin
			declare cursM0 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
				Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
					on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM0
			fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select IsViewed from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
					continue
				end
				else
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)	
					set @counter += 1
					if(@counter = 10)
					begin
						break
					end
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
				end
			end
			close cursM0
			deallocate cursM0
		end
		else
		begin
			declare cursM0 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
				Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
					on Company.Id = Vacancy.CompanyId where Technologies LIKE '%'+@techFilter+'%' order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM0
			fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select IsViewed from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
					continue
				end
				else
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)	
					set @counter += 1
					if(@counter = 10)
					begin
						break
					end
					fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
				end
			end			
			close cursM0
			deallocate cursM0
		end
	end
	else if(@filter = 'board')
	begin
		declare cursM0 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
		open cursM0
		fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		while @@FETCH_STATUS=0
		begin		
			if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select BoardStatus from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) is null)
			begin
				fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
				continue
			end
			else
			begin
				if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
				begin		
					set @isViewed = 0
					set @isRemoved = 0
					set @boardStatus = null
					set @comment = null
				end	
				else
				begin
					set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
				end
				insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
					@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
				set @counter += 1
				if(@counter = 10)
				begin
					break
				end
				fetch next from cursM0 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			end
		end	
		close cursM0
		deallocate cursM0
	end
	return
end
GO

CREATE function [dbo].[testF1](@idV uniqueidentifier, @idC uniqueidentifier, @filter nvarchar(30), @techFilter nvarchar(30))
returns @ret table (VacancyId uniqueidentifier, Url nvarchar(500), Position nvarchar(200), Location nvarchar(100), Description nvarchar(max),
		 SiteAddingDate nvarchar(10), CompanyName nvarchar(100), Website nvarchar(300), Country nvarchar(50),Type nvarchar(100), DbAddingDate datetime, IsViewed bit,
		  IsRemoved bit, BoardStatus nvarchar(15), Comment nvarchar(300), Technologies nvarchar(max)) as
	begin
	declare @vacId uniqueidentifier, @url nvarchar(500), @position nvarchar(500), @location nvarchar(100), @description nvarchar(max), 
	 @siteAddingDate nvarchar(10), @companyName nvarchar(100), @website nvarchar(300), @country nvarchar(50), @type nvarchar(100), @DbAddingDate datetime,
	  @isViewed bit, @isRemoved bit, @boardStatus nvarchar(15), @counter int = 0, @comment nvarchar(300), @technologies nvarchar(max)
	if(@filter = 'all')
	begin
		if(@techFilter = 'undefined')
		begin
			declare cursM1 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
				Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
					on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM1
			fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin
				if(@counter > 0)
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						if((select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
						begin
							fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
							continue
						end
						else
						begin
							set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						end
					end				
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)	
					set @counter += 1
				end
				if(@counter = 11)
				begin
					break
				end
				if(@vacId = @idV)
				begin
					set @counter += 1
				end
				fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			end
			close cursM1
			deallocate cursM1
		end
		else
		begin
			declare cursM1 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
				Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
					on Company.Id = Vacancy.CompanyId where Technologies LIKE '%'+@techFilter+'%' order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
			open cursM1
			fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			while @@FETCH_STATUS=0
			begin
				if(@counter > 0)
				begin
					if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
					begin		
						set @isViewed = 0
						set @isRemoved = 0
						set @boardStatus = null
						set @comment = null
					end	
					else
					begin
						if((select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
						begin
							fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
							continue
						end
						else
						begin
							set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
							set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						end
					end				
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
						@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)	
					set @counter += 1
				end
				if(@counter = 11)
				begin
					break
				end
				if(@vacId = @idV)
				begin
					set @counter += 1
				end
				fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			end			
			close cursM1
			deallocate cursM1
		end		
	end
	else if(@filter = 'unviewed')
	begin
	if(@techFilter = 'undefined')
	begin
		declare cursM1 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
		open cursM1
		fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		while @@FETCH_STATUS=0
		begin
			if(@counter > 0)
			begin
				if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
				begin		
					set @isViewed = 0
					set @isRemoved = 0
					set @boardStatus = null
					set @comment = null
				end	
				else
				begin
					if((select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
					begin
						fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
						continue
					end
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
				end				
				insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
					@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
				set @counter += 1
			end
			if(@counter = 11)
			begin
				break
			end
			if(@vacId = @idV)
			begin
				set @counter += 1
			end
			fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		end		
		close cursM1
		deallocate cursM1
	end
	else
	begin
		declare cursM1 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId where Technologies LIKE '%'+@techFilter+'%' order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
		open cursM1
		fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		while @@FETCH_STATUS=0
		begin
			if(@counter > 0)
			begin
				if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
				begin		
					set @isViewed = 0
					set @isRemoved = 0
					set @boardStatus = null
					set @comment = null
				end	
				else
				begin
					if((select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
					begin
						fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
						continue
					end
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
				end				
				insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
					@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
				set @counter += 1
				end
				if(@counter = 11)
				begin
					break
				end
				if(@vacId = @idV)
				begin
					set @counter += 1
				end
				fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
			end			
			close cursM1
			deallocate cursM1
		end
	end
	if(@filter = 'board')
	begin
		declare cursM1 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
			Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
				on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
		open cursM1
		fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		while @@FETCH_STATUS=0
		begin
			if(@counter > 0)
			begin
				if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
				begin		
					set @isViewed = 0
					set @isRemoved = 0
					set @boardStatus = null
					set @comment = null
				end	
				else
				begin
					if((select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId) is null)
					begin
						fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
						continue
					end
					else
					begin
						set @isViewed = (select IsViewed from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @isRemoved = (select IsRemoved from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @boardStatus = (select BoardStatus from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
						set @comment = (select Comment from clientsVacancy where ClientId = @idC and VacancyId = @vacId)
					end
				end				
				insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
					@DBAddingDate, @isViewed, @isRemoved, @boardStatus, @comment, @technologies)
				set @counter += 1
			end
			if(@counter = 11)
			begin
				break
			end
			if(@vacId = @idV)
			begin
				set @counter += 1
			end
			fetch next from cursM1 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		end
		close cursM1
		deallocate cursM1
	end
	return
end
GO

CREATE function [dbo].[testF2](@idV uniqueidentifier, @filter nvarchar(10), @idC uniqueidentifier, @techFilter nvarchar(max))--написать с учётом фильтра
returns int
as
	begin
	declare @ret int = 0
	declare @vacId uniqueidentifier, @counter int = 0
	if (@filter = 'all')
	begin
		if(@techFilter = 'undefined')
		begin
			declare cursM cursor for select Id from Vacancy order by DbAddingDate DESC, Url, position
			open cursM
			fetch next from cursM into @vacId
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM into @vacId
					continue
				end
				else
				begin			
					if(@counter > 0)
					begin
						set @ret += 1
					end
					if(@vacId = @idV)
					begin
						set @counter += 1 -- тут мы нашли вакансию от которой мы просматриваем
					end
					fetch next from cursM into @vacId
				end
			end			
			close cursM
			deallocate cursM
		end
		else
		begin
			declare cursM cursor for select Id from Vacancy where Technologies LIKE '%'+@techFilter+'%' order by DbAddingDate DESC, Url, position
			open cursM
			fetch next from cursM into @vacId
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM into @vacId
					continue
				end
				else
				begin			
					if(@counter > 0)
					begin
						set @ret += 1
					end
					if(@vacId = @idV)
					begin
						set @counter += 1 -- тут мы нашли вакансию от которой мы просматриваем
					end
					fetch next from cursM into @vacId
				end
			end			
			close cursM
			deallocate cursM
		end
	end
	if (@filter = 'unviewed')
	begin
		if(@techFilter = 'undefined')
		begin
			declare cursM cursor for select Id from Vacancy order by DbAddingDate DESC, Url, position
			open cursM
			fetch next from cursM into @vacId
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM into @vacId
					continue
				end
				else
				begin			
					if(@counter > 0)
					begin
						set @ret += 1
					end
					if(@vacId = @idV)
					begin
						set @counter += 1 -- тут мы нашли вакансию от которой мы просматриваем
					end
					fetch next from cursM into @vacId
				end
			end			
			close cursM
			deallocate cursM
		end
		else		
		begin			
			declare cursM cursor for select Id from Vacancy where Technologies LIKE '%'+@techFilter+'%' order by DbAddingDate DESC, Url, position
			open cursM
			fetch next from cursM into @vacId
			while @@FETCH_STATUS=0
			begin
				if((select isRemoved from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1 or (select IsViewed from ClientsVacancy where ClientId = @idC and VacancyId = @vacId) = 1)
				begin
					fetch next from cursM into @vacId
					continue
				end
				else
				begin			
					if(@counter > 0)
					begin
						set @ret += 1
					end
					if(@vacId = @idV)
					begin
						set @counter += 1 -- тут мы нашли вакансию от которой мы просматриваем
					end
					fetch next from cursM into @vacId
				end
			end			
			close cursM
			deallocate cursM
		end
	end
	return @ret
end
GO

CREATE function [dbo].[testF3](@idV uniqueidentifier, @idC uniqueidentifier)--дописать счётчик по фильтру
returns int
as
	begin
	declare @ret int = 0, @vacId uniqueidentifier
	declare cursM1 cursor for select Id from Vacancy order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
	open cursM1
	fetch next from cursM1 into @vacId
	while @@FETCH_STATUS=0
	begin
		if(@vacId = @idV)
		begin
			break
		end
		if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
		begin		
			set @ret += 1;
		end	
		else if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 1)
		begin
			if((select IsRemoved from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
			begin
				set @ret += 1;				
			end
		end
		fetch next from cursM1 into @vacId
	end
	return @ret
end
GO

CREATE function [dbo].[testF4](@idV uniqueidentifier, @idC uniqueidentifier)
returns @ret table (VacancyId uniqueidentifier, Url nvarchar(500), Position nvarchar(200), Location nvarchar(100), Description nvarchar(max),
		 SiteAddingDate nvarchar(10), CompanyName nvarchar(100), Website nvarchar(300), Country nvarchar(50),Type nvarchar(100), DbAddingDate datetime, IsViewed bit,
		  IsRemoved bit, BoardStatus nvarchar(15), Comment nvarchar(300), Technologies nvarchar(max)) as
	begin
		declare @vacId uniqueidentifier, @url nvarchar(500), @position nvarchar(500), @location nvarchar(100), @description nvarchar(max), 
		 @siteAddingDate nvarchar(10), @companyName nvarchar(100), @website nvarchar(300), @country nvarchar(50), @type nvarchar(100), @DbAddingDate datetime,
		  @isViewed bit, @isRemoved bit, @boardStatus nvarchar(15), @counter int = 0, @comment nvarchar(300), @technologies nvarchar(max)
		declare cursM4 cursor for select Vacancy.Id as vacancyId, url, position, location, Description,convert(nvarchar(10),SiteAddingDate,104) as SiteAddingDate,
					Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, Technologies from Vacancy left join Company
						on Company.Id = Vacancy.CompanyId where DbAddingDate > (select DbAddingDate from Vacancy where Id = @idV) order by Vacancy.DbAddingDate DESC, Vacancy.Url, position
		open cursM4
		fetch next from cursM4 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		while @@FETCH_STATUS=0
		begin
			if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
			begin
				insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
				 @DBAddingDate, 0, 0, null, null, @technologies)	
			end
			else if((select count(*) from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 1)
			begin
				if((select IsRemoved from ClientsVacancy where @vacId = VacancyId and @idC = ClientId) = 0)
				begin
					insert into @ret values (@vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type,
					 @DBAddingDate, 0, 0, null, null, @technologies)			
				end
			end
			fetch next from cursM4 into @vacId, @url, @position, @location, @description, @siteAddingDate, @companyName, @website, @country, @type, @DBAddingDate, @technologies
		end
		close cursM4
		deallocate cursM4
		return
	end
GO

CREATE TABLE [dbo].[Client](
	[Id] [uniqueidentifier] NOT NULL,
	[Login] [nvarchar](20) NOT NULL,
	[Password] [nvarchar](25) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
 CONSTRAINT [IdUser] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Login] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ClientsVacancy](
	[ClientId] [uniqueidentifier] NOT NULL,
	[VacancyId] [uniqueidentifier] NOT NULL,
	[IsViewed] [bit] NOT NULL,
	[IsRemoved] [bit] NOT NULL,
	[BoardStatus] [nvarchar](15) NULL,
	[Comment] [nvarchar](300) NULL,
UNIQUE NONCLUSTERED 
(
	[ClientId] ASC,
	[VacancyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Company](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Type] [nvarchar](100) NULL,
	[Website] [nvarchar](300) NULL,
	[Country] [nvarchar](50) NULL,
 CONSTRAINT [IdCompany] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[DataSource](
	[Id] [uniqueidentifier] NOT NULL,
	[Url] [nvarchar](500) NOT NULL,
	[UserNote] [nvarchar](max) NULL,
	[LastProcessingDate] [datetime] NULL,
 CONSTRAINT [IdDataSource] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Url] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Parsers](
	[ParserId] [uniqueidentifier] NOT NULL,
	[ParserToken] [nvarchar](30) NOT NULL,
	[ParserKey] [nvarchar](30) NOT NULL,
	[ParserLastReadBdDate] [datetime] NULL,
	[ParserState] [bit] NOT NULL,
	[ParserDescription] [nvarchar](300) NOT NULL,
 CONSTRAINT [ParserIdKey] PRIMARY KEY CLUSTERED 
(
	[ParserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[ParserToken] ASC,
	[ParserKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Vacancy](
	[Id] [uniqueidentifier] NOT NULL,
	[Url] [nvarchar](500) NOT NULL,
	[DataSourceId] [uniqueidentifier] NOT NULL,
	[CompanyId] [uniqueidentifier] NULL,
	[Position] [nvarchar](200) NOT NULL,
	[Location] [nvarchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[SiteAddingDate] [date] NULL,
	[DbAddingDate] [datetime] NOT NULL,
	[Contacts] [nvarchar](200) NULL,
	[Technologies] [nvarchar](max) NULL,
 CONSTRAINT [IdVacancy] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Client] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[ClientsVacancy] ADD  DEFAULT ((0)) FOR [IsViewed]
GO
ALTER TABLE [dbo].[ClientsVacancy] ADD  DEFAULT ((0)) FOR [IsRemoved]
GO
ALTER TABLE [dbo].[ClientsVacancy] ADD  DEFAULT (NULL) FOR [BoardStatus]
GO
ALTER TABLE [dbo].[ClientsVacancy] ADD  DEFAULT (NULL) FOR [Comment]
GO
ALTER TABLE [dbo].[Parsers] ADD  DEFAULT (newid()) FOR [ParserId]
GO
ALTER TABLE [dbo].[Parsers] ADD  DEFAULT ((0)) FOR [ParserState]
GO
ALTER TABLE [dbo].[Vacancy] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[Vacancy] ADD  DEFAULT (NULL) FOR [Technologies]
GO
ALTER TABLE [dbo].[ClientsVacancy]  WITH CHECK ADD  CONSTRAINT [ClientVacId] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Client] ([Id])
GO
ALTER TABLE [dbo].[ClientsVacancy] CHECK CONSTRAINT [ClientVacId]
GO
ALTER TABLE [dbo].[ClientsVacancy]  WITH CHECK ADD  CONSTRAINT [VacancyCliId] FOREIGN KEY([VacancyId])
REFERENCES [dbo].[Vacancy] ([Id])
GO
ALTER TABLE [dbo].[ClientsVacancy] CHECK CONSTRAINT [VacancyCliId]
GO
ALTER TABLE [dbo].[Vacancy]  WITH CHECK ADD  CONSTRAINT [IdVacancyCompany] FOREIGN KEY([CompanyId])
REFERENCES [dbo].[Company] ([Id])
GO
ALTER TABLE [dbo].[Vacancy] CHECK CONSTRAINT [IdVacancyCompany]
GO
ALTER TABLE [dbo].[Vacancy]  WITH CHECK ADD  CONSTRAINT [IdVacancyDataSource] FOREIGN KEY([DataSourceId])
REFERENCES [dbo].[DataSource] ([Id])
GO
ALTER TABLE [dbo].[Vacancy] CHECK CONSTRAINT [IdVacancyDataSource]
GO
ALTER TABLE [dbo].[Client]  WITH CHECK ADD CHECK  ((len([Login])>=(5)))
GO
ALTER TABLE [dbo].[Client]  WITH CHECK ADD CHECK  ((len([Password])>=(6)))
GO

CREATE procedure [dbo].[InsertNewVacancy] @json nvarchar(max)
as
declare @DataSourceId uniqueidentifier
if exists(select * from DataSource where convert(nvarchar(255), Url) = json_value(@json, '$.url'))
begin
	select @DataSourceId = Id from DataSource where Url = json_value(@json, '$.url')
	update DataSource set LastProcessingDate = getdate() where Id = @DataSourceId
end
else
begin
	set @DataSourceId = newid()
	insert into DataSource values(@DataSourceId, json_value(@json, '$.url'), null, getdate())
end

declare @Company_name nvarchar(100),
	@Type nvarchar(100),
	@Website nvarchar(300),
	@Country nvarchar(50),
	@Url nvarchar(500),
	@Position nvarchar(200),
	@Location nvarchar(100),
	@Description nvarchar(max),
	@SiteAddingDate date,
	@Contacts nvarchar(200),
	@Technologies nvarchar(max)

declare cur1 cursor local
for select *
from openjson(@json, '$.positions')
with (
    Company_name nvarchar(100) '$.company_name',
	Type nvarchar(100) '$.industry',
	Website nvarchar(300) '$.website',
	Country nvarchar(50) '$.company_country',
	Url nvarchar(500) '$.url',
	Position nvarchar(200) '$.position',
	Location nvarchar(100) '$.location',
	Description nvarchar(max) '$.description',
	SiteAddingDate date '$.date',
	Contacts nvarchar(200) '$.contacts',
	Techonologies nvarchar(max) '$.technologies'
)

begin try
	open cur1

	fetch next from cur1 into @Company_name, @Type, @Website, @Country, @Url, @Position, @Location, @Description, @SiteAddingDate, @Contacts, @Technologies

	while @@fetch_status = 0
	begin
		declare @CompanyId uniqueidentifier
		if @Company_name is not null
		begin
			if exists(select * from Company where Name = @Company_name)
				select @CompanyId = Id from Company where Name = @Company_name
			else
			begin
				set @CompanyId = newid()
				insert into Company values(@CompanyId, @Company_name, @Type, @Website, @Country)
			end
		end
		else set @CompanyId = null

		if dbo.isExist(@Url, @Position, @CompanyId) < 1
			insert into Vacancy(Url, DataSourceId, CompanyId, Position, Location, Description, SiteAddingDate, DbAddingDate, Contacts, Technologies)
				values(@Url, @DataSourceId, @CompanyId, @Position, @Location, @Description, @SiteAddingDate, getdate(), @Contacts, @Technologies) --потом когда парсер начнёт контакты собирать добавить считку ещё и контаков

		fetch next from cur1 into @Company_name, @Type, @Website, @Country, @Url, @Position, @Location, @Description, @SiteAddingDate, @Contacts, @Technologies
	end 

	close cur1
end try
begin catch
	close cur1
end catch
GO

create procedure [dbo].[ParsersInsert] @token nvarchar(30), @apiKey nvarchar(30),@state bit, @description nvarchar(300)
as
begin
	insert into Parsers(ParserToken, ParserKey, ParserLastReadBdDate,ParserState, ParserDescription) values(@token,@apiKey,null,@state,@description)
end
GO

CREATE procedure [dbo].[ParsersUpdate] @idP uniqueidentifier, @state bit, @description nvarchar(300)
as
begin
	update Parsers set ParserState = @state, ParserDescription = @description where ParserId = @idP
end
GO

CREATE procedure [dbo].[updateStateClientVacancy] @idC uniqueidentifier, @idV uniqueidentifier, @isView bit, @isRemov bit, @boardStat nvarchar(15), @comment nvarchar(300)
as
	begin
	if((select count(*) from clientsVacancy where ClientId = @idC and VacancyId = @idV) = 0)
	begin
		insert into ClientsVacancy values (@idC, @idV, @isView, @isRemov, @boardStat, @comment)
	end
	else
	begin
		update ClientsVacancy set isViewed = @isView, isRemoved = @isRemov,
			boardStatus = @boardStat, Comment = @comment where ClientId = @idC and VacancyId = @idV
	end
end
GO
