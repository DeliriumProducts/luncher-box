import { TransformValidationOptions } from 'class-transformer-validator';
import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam
} from 'routing-controllers';
import { getRepository, MoreThan, Repository } from 'typeorm';
import { DuplicateTableError, Table, TableNotFoundError, TableNotValidError } from '../entities';
import { QueryResponse, TransformAndValidateTuple } from '../types';
import { transformAndValidate } from '../utils';

@JsonController('/tables')
export class TableController {
  private tableRepository: Repository<Table>;
  private transformAndValidateTable: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<Table>;

  /**
   * Load the Table repository
   */
  constructor() {
    this.tableRepository = getRepository(Table);
    this.transformAndValidateTable = transformAndValidate(Table);
  }

  /**
   * GET /tables
   *
   * Gets all tables
   * @param page
   * @param limit
   * @param since
   */
  @Get()
  async getAll(
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit: number = 0,
    @QueryParam('since') since?: number
  ) {
    if (since) {
      const tables = await this.tableRepository.find({
        where: { id: MoreThan(since) },
        take: limit,
        cache: true
      });

      return tables;
    }

    if (page) {
      const tables = await this.tableRepository.find({
        skip: limit * (page - 1),
        take: limit,
        cache: true
      });

      return tables;
    } else {
      const tables = await this.tableRepository.find({
        take: limit,
        cache: true
      });

      return tables;
    }
  }

  /**
   * GET /tables/:tableId
   *
   * Gets a table based on its Id
   * @param tableId
   */
  @Get('/:tableId')
  async getOne(@Param('tableId') id: number) {
    const table = await this.tableRepository.findOne(id);

    if (table) {
      return table;
    }

    throw new TableNotFoundError();
  }

  /**
   * POST /tables
   *
   * Creates a table based on the request's body
   * @param tableJSON
   */
  @Post()
  @Authorized('Admin')
  async create(@Body() tableJSON: Table) {
    /**
     * Check if there is a table with the same name already
     */
    if (await this.tableRepository.findOne({ where: { name: tableJSON.name } })) {
      throw new DuplicateTableError();
    }

    const [table, tableErr] = await this.transformAndValidateTable(tableJSON);

    if (tableErr.length) {
      throw new TableNotValidError(tableErr);
    }

    return await this.tableRepository.save(table);
  }

  /**
   *  PUT /tables/:tableId
   *
   * Updates a table based on the request's body and id paramter
   * @param id
   * @param newTableJSON
   */
  @Put('/:tableId')
  @Authorized('Admin')
  async update(@Param('tableId') id: number, @Body() newTableJSON: Table) {
    /**
     * Check if the table exists before updating it
     */
    const oldTable: QueryResponse<Table> = await this.tableRepository.findOne(id);

    if (oldTable) {
      /**
       * Check if there is a table with the same name already
       */
      if (oldTable.name === newTableJSON.name) {
        throw new DuplicateTableError();
      }
      const [newTable, tableErr] = await this.transformAndValidateTable(newTableJSON);

      if (tableErr.length) {
        throw new TableNotValidError(tableErr);
      }

      delete newTable.orders;
      newTable.id = oldTable.id;

      return await this.tableRepository.save(newTable);
    }

    throw new TableNotFoundError();
  }

  /**
   * DELETE /tables/:tableId
   *
   * Delets a table based on the request's body and id paramter
   * @param id
   */
  @Delete('/:tableId')
  @Authorized('Admin')
  async delete(@Param('tableId') id: number) {
    /**
     * Check if the table exists before deleting it
     */
    const tableToBeDeleted: QueryResponse<Table> = await this.tableRepository.findOne(id);

    if (tableToBeDeleted) {
      await this.tableRepository.delete(id);
      return 'Table deleted!';
    }

    throw new TableNotFoundError();
  }
}
