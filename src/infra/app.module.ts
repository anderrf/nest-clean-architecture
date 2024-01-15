import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './../infra/auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
