---
title: 'Using React Redux Connect with TypeScript'
date: '2020-07-21'
---

When using Redux in a TypeScript React Application, we will run into some snags. One of the main ones is **correctly typing Components using connect**. We want to **get type inference** whenever possible to reduce human error when using typescript. Fortunately there is an easy a way to use Redux's connect with type inference in our TSX projects by leveraging the **Dispatch**, and **ConnectedProps** types. You will be able to get types straight from your **mapStateToProps** and **mapDispatchToProps** into any **React Class Component** or **React Functional Component**.

## Typing your Component with ConnectedProps

To use connect and get type inference **State**, **Selectors**, and **Actions** must be typed already. They can all be set up to get _automatic type inference_ with the correct setup. If this is not done yet, go to [Redux Type Setup](#redux-type-setup-root-reducer-actions-and-selectors)

We will be working with a theoretical **Header Component** that gets user information from Redux.

The full guide starts [after the resulting code](#typing-mapstatetoprops).

### TLDR: Resulting Code

```typescript
import React, { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';

//Our Type Imports
import { State } from '../../redux/root-reducer.types';
import { UserActions } from '../../redux/user/user.types';

const Header: React.FC<HeaderProps> = ({
	currentUser,
	signOutStart,
}) => (
	... //Component Code
)

const mapStateToProps = (state: State) => ({
	currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = (dispatch: Dispatch<UserActions>) => ({
	signOutStart: () => dispatch(signOutStart())
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type HeaderProps = ConnectedProps<typeof connector>;

export default connector(Header)
```

### Typing mapStateToProps

Once your selectors have been imported into your Component you must select the _slice_ of state, _or slices_ of state that you need passed as a prop to your component. You pass them to mapStateToProps as follows:

```typescript
//Imports
import { State } from '../../redux/root-reducer.types';

//Code
const mapStateToProps = (state: State) => ({
	currentUser: selectCurrentUser(state),
});
```

Here we use the **State** type which we got from our **Root Reducer**:

Additional information in [Typing your Root Reducer](#typing-your-root-reducer)

### Typing mapDipsatchToProps

We need the **Dispatch type** from React, and **Action Types** for the actions we will be using:

```typescript
//Imports
import React, { Dispatch } from 'react';
import { UserActions } from '../../redux/user/user.types';

//Code
const mapDispatchToProps = (dispatch: Dispatch<UserActions>) => ({
	signOutStart: () => dispatch(signOutStart()),
});
```

**Dispatch** needs the Actions it will be expecting to dispatch as the type in its _generic_.

Additional information in [Typing Actions](#typing-actions).

### Connect and ConnectedProps

The part that varies the most in typing connect is that we need to break it into a two step process. We must **extract the types first** and **then connect the Component**. We must create a new variable containing a partial execution of connect, called **connector** by convention.

```typescript
const connector = connect(mapStateToProps, mapDispatchToProps);
```

Once this is done we need to extract the types using **ConnectedProps** from react-redux.

```typescript
//Imports
import { connect, ConnectedProps } from 'react-redux';

//Code
type HeaderProps = ConnectedProps<typeof connector>;
```

Our new type **HeaderProps** contains the props that we will pass to the component. Once we have this we use connector on our Header Component. The full code would be:

```typescript
const connector = connect(mapStateToProps, mapDispatchToProps);

type HeaderProps = ConnectedProps<typeof connector>;

export default connector(Header);
```

### Functional Component Props

Now that we have the type for the props, we just pass them to our Functional Component using **React.FC**:

```typescript
const Header: React.FC<HeaderProps> = ({
	currentUser,
	signOutStart,
}) => (
	...
)
```

Congratulations! Now you have TS inference in your Functional Component.

Once we have all of this done we will have our [Resulting Code](#tldr-resulting-code).

### Class Component Props

The react **Class Component** type needs two types in order to work: **Props**, and **Internal State**:

```typescript
interface HeaderState {
	...
}

class Header extends Component<HeaderProps, HeaderState> {
	constructor(props: HeaderProps){
		super(props);
		this.state = {
			... //Something Matching HeaderState
		}
	}
	...
}
```

We get the props from our Redux **HeaderProps** and our **Header State** must match the interface we set for full support. **If we aren't using any internal state, we can omit the second type in the generic**.

## Redux Type Setup: State, Root Reducer, Actions, and Selectors

Static typing can be like building a skyscraper: It is **only as strong as its foundation**. In the case of Redux the foundations are typing the **Root Reducer**, **Actions**, and **Selectors**. If you have already done this step, skip to [Typing your Component with ConnectedProps](#typing-your-component-with-connectedprops).

### Typing your Root Reducer

The first thing we need to do is get the type for our **State**, which is what our Root Reducer returns. My recommendation is to _keep a separate \*.types.ts file_ for any file you are typing to **have a standardized file structure**.

**root-reducer.types.ts**

```typescript
import { rootReducer } from './root-reducer';

export type State = ReturnType<typeof rootReducer>;
```

This uses typescript's **ReturnType** to create a State type that updates as your Root Reducer grows and changes. This works by _creating a type based on what our Root Reducer returns_, which is our State. This approach **will only work if you have correctly typed your reducers**. [TS Advanced Types DOCS for ReturnType](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types)

### Typing Reducers

To type your Reducers, you will need two types, the type for your **localState** and your **localActions**. In the case of creating a Reducer for the slice of state holding Users we would do the following:

```typescript
import { Reducer } from 'react';
import { UserActions, UserState, UserActionTypes } from './user.types';

const INTIAL_STATE: UserState = {
	...
}

const userReducer: Reducer<UserState, UserActions> = (
	state = INTIAL_STATE,
	action
) => {
	switch (action.type) {
		case UserActionTypes.SIGN_IN_SUCCESS:
			return {
				...
			}
		case ...
	}
};
```

We leverage the **Reducer** type from react, which needs two types in the generic: **State**, and **Actions**. Additionally, we have **ActionTypes** to get inference in our _Switch Statement_. With this setup, we **the Root Reducer's type gets automatically updated when we add new reducers to it**.

### Typing Actions

In our `userReducer` we used types for our **UserActions** and **UserActionTypes**. The basic structure of an Redux Action is:

```typescript
const ActionName = (payload: PayloadType) => ({
	type: string;
	payload: PayloadType;
})
```

Which returns an object with type and payload, which is our **Action**. For each action we have a **predefined action "type"** which we will type and use in our **ActionObject interfaces**. [Redux Actions DOCS](<https://redux.js.org/basics/actions#:~:text=Actions%20are%20payloads%20of%20information,dispatch()%20.>)

#### ActionTypes

We create our types in **user.types.ts** using:

```typescript
export const UserActionTypes = {
	SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
	SING_IN_FAILURE: 'SIGN_IN_FAILURE',
	...
} as const;
```

They key part is to **use as const** at the end. This will tell TS that the strings in our object **will never change** which will make it work and infer in our _Switch Statement_. [TS Const Assertions DOCS](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

#### ActionObjects

For the objects that our actions will return, we will create **interfaces**:

```typescript
interface SignInSuccessAction {
	type: typeof UserActionTypes.SIGN_IN_SUCCESS;
	payload: CurrentUser | null;
}
```

Here we used our hard-coded **ActionTypes** for the type property in our Action Object.

Once we have all of our ActionObjects typed we create a **Discriminated Union to export all of our ActionObjects under a single type**. [TS Discriminated Union DOCS](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions)

```typescript
export type UserActions =
	| SignInSuccessAction
	| SignInFailureAction
	| ...
```

We can **stack as many actions as we want**, and we can get type inference where we need to use actions just by using **UserActions** like we did in our Reducer.

### Typing Selectors

We need a **State** type and a **localState** type to type Selectors. The localState is typed manually, in our case it is:

```typescript
export interface UserState {
	currentUser: null | CurrentUser;
	error: null | string;
}
```

We get **State** from our root-reducer.types.ts file and use the **Selector type** from react-redux.

```typescript
//Standard Imports
...
//Type Imports
import { Selector } from 'react-redux';
import { State } from '../root-reducer.types';
import { UserState } from '.user.types';

const selectUser: Selector<State, UserState> = (state) => state.user;

export const selectCurrentUser = createSelector(
	[selectUser],
	(user) => user.currentUser
);
```

Now when we use the selector in our Component and use **mapStateToProps will infer the prop from the selector directly**.

Once you have the setup completed, you can start [Typing your Component using Redux connect](#typing-your-component-with-connectedprops).

## Conclusion

Using Redux with TypeScript and React TSX in your application is a powerful tool that is easy to implement **if you have your type foundations covered**. Now you can get type inference for your Functional Components or Class Components with the use of **connect**. The key is using ConnectedProps from react-redux, Dispatch from react, and to use your own State, and Action types for mapStateToProps and mapDispatchToProps. _To get the most off-hands and safest experience, type your Root Reducer, Actions, and Selectors_ to [set up your type foundations](#redux-type-setup-root-reducer-actions-and-selectors).
